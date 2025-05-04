/**
 * ניהול לשונית המקומות
 */
import PlaceManager from '../models/PlaceManager.js';
import { showToast, openModal, closeAllModals, showDeleteConfirmation } from '../utils/ui.js';

// יצירת מופע של מנהל המקומות
const placeManager = new PlaceManager();

/**
 * אתחול לשונית המקומות
 */
export function initPlacesTab() {
    // קישור אירועים
    document.getElementById('add-place-btn').addEventListener('click', addPlace);
    document.getElementById('place-input').addEventListener('keypress', e => {
        if (e.key === 'Enter') addPlace();
    });
    
    // קישור פילטר קטגוריות
    document.getElementById('place-filter').addEventListener('change', renderPlaces);
    
    // קישור לחצני סינון עדיפות
    document.querySelectorAll('.priority-filter-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.target.closest('.priority-filter-btn').classList.toggle('active');
            renderPlaces();
        });
    });
    
    // אתחול מודאל עריכה
    document.querySelector('#edit-place-modal .close-btn').addEventListener('click', closeAllModals);
    document.querySelector('#edit-place-form button[type="button"]').addEventListener('click', closeAllModals);
    document.getElementById('edit-place-form').addEventListener('submit', e => {
        e.preventDefault();
        
        const id = document.getElementById('edit-place-id').value;
        const name = document.getElementById('edit-place-name').value;
        const address = document.getElementById('edit-place-address').value;
        const category = document.getElementById('edit-place-category').value;
        const priority = document.getElementById('edit-place-priority').value;
        const notes = document.getElementById('edit-place-notes').value;
        const visited = document.getElementById('edit-place-visited').checked;
        
        // אם יש ID, עדכן מקום קיים
        if (id) {
            placeManager.updateItem(id, { 
                name, 
                address, 
                category, 
                priority,
                notes,
                visited 
            });
            showToast('המקום עודכן בהצלחה');
        } else {
            // אחרת, הוסף מקום חדש
            const newPlace = {
                id: Date.now().toString(),
                name,
                address,
                category,
                priority,
                notes,
                visited,
                createdAt: new Date().toISOString()
            };
            placeManager.addItem(newPlace);
            showToast('המקום נוסף בהצלחה');
        }
        
        renderPlaces();
        closeAllModals();
    });
    
    // רינדור ראשוני של המקומות
    renderPlaces();
}

/**
 * הוספת מקום חדש
 */
function addPlace() {
    const placeInput = document.getElementById('place-input');
    const placeText = placeInput.value.trim();
    
    if (placeText) {
        // איפוס הטופס והגדרת ערכי ברירת מחדל
        document.getElementById('edit-place-form').reset();
        document.getElementById('edit-place-id').value = '';
        document.getElementById('edit-place-name').value = placeText;
        document.getElementById('edit-place-category').value = 'attraction';
        document.getElementById('edit-place-priority').value = 'medium';
        document.getElementById('edit-place-visited').checked = false;
        
        // פתיחת המודאל
        openModal('edit-place-modal');
        // ניקוי שדה הקלט
        placeInput.value = '';
    }
}

/**
 * עריכת מקום קיים
 * @param {Object} place - המקום לעריכה
 */
function editPlace(place) {
    document.getElementById('edit-place-id').value = place.id;
    document.getElementById('edit-place-name').value = place.name;
    document.getElementById('edit-place-address').value = place.address || '';
    document.getElementById('edit-place-category').value = place.category || 'attraction';
    document.getElementById('edit-place-priority').value = place.priority || 'medium';
    document.getElementById('edit-place-notes').value = place.notes || '';
    document.getElementById('edit-place-visited').checked = place.visited || false;
    
    openModal('edit-place-modal');
}

/**
 * רינדור רשימת המקומות
 */
function renderPlaces() {
    const placeList = document.getElementById('place-list');
    const emptyState = document.getElementById('empty-places-state');
    
    // קבלת המקומות
    let places = placeManager.getAllItems();
    
    // סינון לפי הקטגוריה
    const categoryFilter = document.getElementById('place-filter').value;
    if (categoryFilter !== 'all') {
        places = places.filter(place => place.category === categoryFilter);
    }
    
    // סינון לפי עדיפות (הצג רק עדיפויות שסומנו כפעילות)
    const activePriorities = Array.from(document.querySelectorAll('.priority-filter-btn.active'))
        .map(btn => btn.dataset.priority);
    
    if (activePriorities.length > 0) {
        places = places.filter(place => activePriorities.includes(place.priority));
    }
    
    // מיון המקומות - תחילה לפי האם ביקרו, אחר כך לפי עדיפות
    places.sort((a, b) => {
        if (a.visited !== b.visited) {
            return a.visited ? 1 : -1;
        }
        
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        const priorityA = priorityOrder[a.priority] || 2;
        const priorityB = priorityOrder[b.priority] || 2;
        
        if (priorityA !== priorityB) {
            return priorityA - priorityB;
        }
        
        return a.name.localeCompare(b.name);
    });
    
    // הצגת/הסתרת מצב ריק
    if (places.length === 0) {
        placeList.style.display = 'none';
        emptyState.style.display = 'flex';
    } else {
        placeList.style.display = 'block';
        emptyState.style.display = 'none';
    }
    
    // רינדור המקומות
    placeList.innerHTML = '';
    
    places.forEach(place => {
        // יצירת כרטיס מקום
        const placeCard = document.createElement('div');
        placeCard.className = `place-card ${place.visited ? 'visited' : ''}`;
        
        // יצירת אייקוני קטגוריות
        const categoryIcon = 
            place.category === 'attraction' ? '<i class="fas fa-monument"></i>' :
            place.category === 'museum' ? '<i class="fas fa-landmark"></i>' :
            place.category === 'food' ? '<i class="fas fa-utensils"></i>' :
            place.category === 'nature' ? '<i class="fas fa-tree"></i>' :
            '<i class="fas fa-map-marker-alt"></i>';
        
        // יצירת אייקוני עדיפות
        const priorityIcon = 
            place.priority === 'high' ? '<i class="fas fa-exclamation-circle"></i>' :
            place.priority === 'medium' ? '<i class="fas fa-circle"></i>' :
            '<i class="fas fa-arrow-circle-down"></i>';
        
        // יצירת תגיות עבור הקטגוריה והעדיפות
        let categoryText = '';
        switch (place.category) {
            case 'attraction': categoryText = 'אטרקציה'; break;
            case 'museum': categoryText = 'מוזיאון'; break;
            case 'food': categoryText = 'אוכל'; break;
            case 'nature': categoryText = 'טבע'; break;
            default: categoryText = 'אחר';
        }
        
        placeCard.innerHTML = `
            <div class="place-header">
                <div class="place-main-info">
                    <div class="place-name">${place.name}</div>
                    <div class="place-meta">
                        <div class="place-tags">
                            <span class="priority-tag ${place.priority || 'medium'}">
                                ${priorityIcon}
                                <span class="tag-text">
                                    ${place.priority === 'high' ? 'עדיפות גבוהה' : 
                                      place.priority === 'medium' ? 'עדיפות בינונית' : 'עדיפות נמוכה'}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
                <span class="category-tag ${place.category || 'attraction'}">
                    ${categoryIcon}
                    <span class="tag-text">${categoryText}</span>
                </span>
            </div>
            
            <div class="place-body">
                ${place.address ? `<div class="place-address"><i class="fas fa-map-marker-alt"></i> ${place.address}</div>` : ''}
                ${place.notes ? `<div class="place-notes">${place.notes}</div>` : ''}
            </div>
            
            <div class="place-footer">
                <button class="place-action ${place.visited ? 'visited' : ''}" data-action="toggle-visited" title="${place.visited ? 'סמן כלא ביקרתי' : 'סמן כביקרתי'}">
                    <i class="fas ${place.visited ? 'fa-check-circle' : 'fa-circle'}"></i>
                    <span class="action-text">${place.visited ? 'ביקרתי' : 'טרם ביקרתי'}</span>
                </button>
                ${place.address ? 
                `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}" 
                   target="_blank" class="place-action map-action" title="פתח את המיקום בגוגל מפס (ייפתח בחלון חדש)">
                   <i class="fas fa-map-marked-alt"></i>
                   <span class="action-text">מפה</span>
                </a>` : ''}
                <button class="place-action edit-action" data-action="edit" title="ערוך מקום">
                    <i class="fas fa-edit"></i>
                    <span class="action-text">עריכה</span>
                </button>
                <button class="place-action delete-action" data-action="delete" title="מחק מקום">
                    <i class="fas fa-trash"></i>
                    <span class="action-text">מחיקה</span>
                </button>
            </div>
        `;
        
        // הוספת מאזיני אירועים לכפתורים
        placeCard.querySelector('[data-action="toggle-visited"]').addEventListener('click', () => {
            const newVisitedState = !place.visited;
            placeManager.updateItem(place.id, { visited: newVisitedState });
            renderPlaces();
            showToast(newVisitedState ? 'המקום סומן כביקרתי' : 'המקום סומן כלא ביקרתי');
        });
        
        placeCard.querySelector('[data-action="edit"]').addEventListener('click', () => {
            editPlace(place);
        });
        
        placeCard.querySelector('[data-action="delete"]').addEventListener('click', () => {
            showDeleteConfirmation('האם אתה בטוח שברצונך למחוק את המקום הזה?', () => {
                placeManager.deleteItem(place.id);
                renderPlaces();
                showToast('המקום נמחק בהצלחה');
            });
        });
        
        placeList.appendChild(placeCard);
    });
}

export { renderPlaces }; 