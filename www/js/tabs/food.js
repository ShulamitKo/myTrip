/**
 * ניהול לשונית המסעדות ומקומות האוכל
 */
import FoodManager from '../models/FoodManager.js';
import { showToast, openModal, closeAllModals, showDeleteConfirmation } from '../utils/ui.js';

// יצירת מופע של מנהל המסעדות
const foodManager = new FoodManager();

/**
 * אתחול לשונית המסעדות
 */
export function initFoodTab() {
    // קישור אירועים
    document.getElementById('addFoodBtn').addEventListener('click', addFood);
    document.getElementById('foodInput').addEventListener('keypress', e => {
        if (e.key === 'Enter') addFood();
    });
    
    // קישור פילטר קטגוריות
    document.getElementById('foodFilter').addEventListener('change', renderFood);
    
    // קישור לחצני סינון מחיר
    document.querySelectorAll('.price-filter-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.target.closest('.price-filter-btn').classList.toggle('active');
            renderFood();
        });
    });
    
    // קישור לחצני סינון דירוג
    document.querySelectorAll('.rating-filter-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            document.querySelectorAll('.rating-filter-btn').forEach(b => b.classList.remove('active'));
            e.target.closest('.rating-filter-btn').classList.add('active');
            renderFood();
        });
    });
    
    // אתחול מודאל עריכה
    document.querySelector('#edit-food-modal .close-btn').addEventListener('click', closeAllModals);
    document.querySelector('#edit-food-form .close-modal').addEventListener('click', closeAllModals);
    document.getElementById('edit-food-form').addEventListener('submit', e => {
        e.preventDefault();
        
        const id = document.getElementById('edit-food-id').value;
        const name = document.getElementById('edit-food-name').value;
        const category = document.getElementById('edit-food-category').value;
        const price = document.getElementById('edit-food-price').value;
        const rating = parseInt(document.getElementById('edit-food-rating').value);
        const address = document.getElementById('edit-food-address').value;
        const notes = document.getElementById('edit-food-notes').value;
        const visited = document.getElementById('edit-food-visited').checked;
        
        // אם יש ID, עדכן פריט קיים
        if (id) {
            foodManager.updateItem(id, { 
                name, 
                category, 
                price, 
                rating,
                address,
                notes,
                visited 
            });
            showToast('המסעדה עודכנה בהצלחה');
        } else {
            // אחרת, הוסף פריט חדש
            const newFood = {
                id: Date.now().toString(),
                name,
                category,
                price,
                rating,
                address,
                notes,
                visited,
                createdAt: new Date().toISOString()
            };
            foodManager.addItem(newFood);
            showToast('המסעדה נוספה בהצלחה');
        }
        
        renderFood();
        closeAllModals();
    });
    
    // רינדור ראשוני של המסעדות
    renderFood();
}

/**
 * הוספת מסעדה חדשה
 */
function addFood() {
    const foodInput = document.getElementById('foodInput');
    const foodName = foodInput.value.trim();
    
    if (foodName) {
        // איפוס הטופס והגדרת ערכי ברירת מחדל
        document.getElementById('edit-food-form').reset();
        document.getElementById('edit-food-id').value = '';
        document.getElementById('edit-food-name').value = foodName;
        document.getElementById('edit-food-category').value = 'restaurant';
        document.getElementById('edit-food-price').value = 'medium';
        document.getElementById('edit-food-rating').value = '0';
        document.getElementById('edit-food-visited').checked = false;
        
        // פתיחת המודאל
        openModal('edit-food-modal');
        // ניקוי שדה הקלט
        foodInput.value = '';
    }
}

/**
 * עריכת מסעדה קיימת
 * @param {Object} food - המסעדה לעריכה
 */
function editFood(food) {
    document.getElementById('edit-food-id').value = food.id;
    document.getElementById('edit-food-name').value = food.name;
    document.getElementById('edit-food-category').value = food.category || 'restaurant';
    document.getElementById('edit-food-price').value = food.price || 'medium';
    document.getElementById('edit-food-rating').value = food.rating || 0;
    document.getElementById('edit-food-address').value = food.address || '';
    document.getElementById('edit-food-notes').value = food.notes || '';
    document.getElementById('edit-food-visited').checked = food.visited || false;
    
    openModal('edit-food-modal');
}

/**
 * רינדור רשימת המסעדות
 */
function renderFood() {
    const foodList = document.getElementById('foodList');
    const emptyState = document.getElementById('emptyFoodState');
    
    // קבלת המסעדות
    let foods = foodManager.getAllItems();
    
    // סינון לפי הקטגוריה
    const categoryFilter = document.getElementById('foodFilter').value;
    if (categoryFilter !== 'all') {
        foods = foods.filter(food => food.category === categoryFilter);
    }
    
    // סינון לפי מחיר (הצג רק רמות מחיר שסומנו כפעילות)
    const activePrices = Array.from(document.querySelectorAll('.price-filter-btn.active'))
        .map(btn => btn.dataset.price);
    
    if (activePrices.length > 0) {
        foods = foods.filter(food => activePrices.includes(food.price));
    }
    
    // סינון לפי דירוג
    const ratingFilter = document.querySelector('.rating-filter-btn.active');
    if (ratingFilter && ratingFilter.dataset.rating !== '0') {
        const minRating = parseInt(ratingFilter.dataset.rating);
        foods = foods.filter(food => food.rating >= minRating);
    }
    
    // מיון המסעדות - תחילה לפי האם ביקרו, אחר כך לפי דירוג (גבוה לנמוך)
    foods.sort((a, b) => {
        if (a.visited !== b.visited) {
            return a.visited ? 1 : -1;
        }
        
        // דירוג - מגבוה לנמוך
        if (a.rating !== b.rating) {
            return b.rating - a.rating;
        }
        
        return a.name.localeCompare(b.name);
    });
    
    // הצגת/הסתרת מצב ריק
    if (foods.length === 0) {
        foodList.style.display = 'none';
        emptyState.style.display = 'flex';
    } else {
        foodList.style.display = 'block';
        emptyState.style.display = 'none';
    }
    
    // רינדור המסעדות
    foodList.innerHTML = '';
    
    foods.forEach(food => {
        // יצירת כרטיס מסעדה
        const foodCard = document.createElement('div');
        foodCard.className = `food-card ${food.visited ? 'visited' : ''}`;
        
        // יצירת אייקוני קטגוריות
        const categoryIcon = 
            food.category === 'restaurant' ? '<i class="fas fa-utensils"></i>' :
            food.category === 'cafe' ? '<i class="fas fa-coffee"></i>' :
            food.category === 'fastfood' ? '<i class="fas fa-hamburger"></i>' :
            food.category === 'dessert' ? '<i class="fas fa-ice-cream"></i>' :
            food.category === 'local' ? '<i class="fas fa-pepper-hot"></i>' :
            '<i class="fas fa-concierge-bell"></i>';
        
        // יצירת אייקוני מחיר
        const priceIcon = 
            food.price === 'cheap' ? '<i class="fas fa-dollar-sign"></i>' :
            food.price === 'medium' ? '<i class="fas fa-dollar-sign"></i><i class="fas fa-dollar-sign"></i>' :
            '<i class="fas fa-dollar-sign"></i><i class="fas fa-dollar-sign"></i><i class="fas fa-dollar-sign"></i>';
        
        // יצירת תגיות עבור הקטגוריה והמחיר
        let categoryText = '';
        switch (food.category) {
            case 'restaurant': categoryText = 'מסעדה'; break;
            case 'cafe': categoryText = 'בית קפה'; break;
            case 'fastfood': categoryText = 'מזון מהיר'; break;
            case 'dessert': categoryText = 'קינוחים'; break;
            case 'local': categoryText = 'אוכל מקומי'; break;
            default: categoryText = 'אחר';
        }
        
        // יצירת כוכבי דירוג
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= food.rating) {
                starsHtml += '<i class="fas fa-star"></i>'; // כוכב מלא
            } else {
                starsHtml += '<i class="far fa-star"></i>'; // כוכב ריק
            }
        }
        
        foodCard.innerHTML = `
            <div class="food-header">
                <div class="food-main-info">
                    <div class="food-name">${food.name}</div>
                    <div class="food-meta">
                        <div class="food-tags">
                            <span class="category-tag ${food.category}">
                                ${categoryIcon}
                                <span class="tag-text">
                                    ${categoryText}
                                </span>
                            </span>
                            <span class="price-tag ${food.price || 'medium'}">
                                ${priceIcon}
                                <span class="tag-text">
                                    ${food.price === 'expensive' ? 'יקר' : food.price === 'cheap' ? 'זול' : 'בינוני'}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="food-body">
                ${food.rating > 0 ? `<div class="food-rating" title="דירוג: ${food.rating} מתוך 5">${starsHtml}</div>` : ''}
                ${food.address ? `<div class="food-address"><i class="fas fa-map-marker-alt"></i> ${food.address}</div>` : ''}
                ${food.notes ? `<div class="food-notes">${food.notes}</div>` : ''}
            </div>
            
            <div class="food-footer">
                <button class="food-action ${food.visited ? 'visited' : ''}" data-action="toggle-visited" title="${food.visited ? 'סמן כלא ביקרתי' : 'סמן כביקרתי'}">
                    <i class="fas ${food.visited ? 'fa-check-circle' : 'fa-circle'}"></i>
                    <span class="action-text">${food.visited ? 'ביקרתי' : 'טרם ביקרתי'}</span>
                </button>
                ${food.address ? 
                `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(food.address)}" 
                   target="_blank" class="food-action map-action" title="פתח את המיקום בגוגל מפס (ייפתח בחלון חדש)">
                   <i class="fas fa-map-marked-alt"></i>
                   <span class="action-text">מפה</span>
                </a>` : ''}
                <button class="food-action edit-action" data-action="edit" title="ערוך מסעדה">
                    <i class="fas fa-edit"></i>
                    <span class="action-text">עריכה</span>
                </button>
                <button class="food-action delete-action" data-action="delete" title="מחק מסעדה">
                    <i class="fas fa-trash"></i>
                    <span class="action-text">מחיקה</span>
                </button>
            </div>
        `;
        
        // הוספת מאזיני אירועים לכפתורים
        foodCard.querySelector('[data-action="toggle-visited"]').addEventListener('click', () => {
            const newVisitedState = !food.visited;
            foodManager.updateItem(food.id, { visited: newVisitedState });
            renderFood();
            showToast(newVisitedState ? 'המסעדה סומנה כביקרתי' : 'המסעדה סומנה כלא ביקרתי');
        });
        
        foodCard.querySelector('[data-action="edit"]').addEventListener('click', () => {
            editFood(food);
        });
        
        foodCard.querySelector('[data-action="delete"]').addEventListener('click', () => {
            showDeleteConfirmation('האם אתה בטוח שברצונך למחוק את המסעדה הזו?', () => {
                foodManager.deleteItem(food.id);
                renderFood();
                showToast('המסעדה נמחקה בהצלחה');
            });
        });
        
        foodList.appendChild(foodCard);
    });
}

export { renderFood }; 