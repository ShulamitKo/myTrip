/**
 * ניהול לשונית הקניות
 */
import ShoppingManager from '../models/ShoppingManager.js';
import { showToast, openModal, closeAllModals, showDeleteConfirmation } from '../utils/ui.js';

// יצירת מופע של מנהל הקניות
const shoppingManager = new ShoppingManager();

/**
 * אתחול לשונית הקניות
 */
export function initShoppingTab() {
    // קישור אירועים
    document.getElementById('addShoppingBtn').addEventListener('click', addShoppingItem);
    document.getElementById('shoppingInput').addEventListener('keypress', e => {
        if (e.key === 'Enter') addShoppingItem();
    });
    
    // קישור פילטר קטגוריות
    document.getElementById('categoryFilter').addEventListener('change', renderShoppingList);
    
    // אתחול מודאל עריכה
    document.querySelector('#edit-shopping-modal .close-btn').addEventListener('click', closeAllModals);
    document.querySelector('#edit-shopping-form button[type="button"]').addEventListener('click', closeAllModals);
    document.getElementById('edit-shopping-form').addEventListener('submit', e => {
        e.preventDefault();
        
        const id = document.getElementById('edit-shopping-id').value;
        const text = document.getElementById('edit-shopping-text').value;
        const category = document.getElementById('edit-shopping-category').value;
        const quantity = parseInt(document.getElementById('edit-shopping-quantity').value);
        const notes = document.getElementById('edit-shopping-notes').value;
        const completed = document.getElementById('edit-shopping-completed').checked;
        
        // אם יש ID, עדכן פריט קיים
        if (id) {
            shoppingManager.updateItem(id, { 
                text, 
                category, 
                quantity, 
                notes,
                completed 
            });
            showToast('פריט הקניות עודכן בהצלחה');
        } else {
            // אחרת, הוסף פריט חדש
            const newItem = {
                id: Date.now().toString(),
                text,
                category,
                quantity,
                notes,
                completed,
                createdAt: new Date().toISOString()
            };
            shoppingManager.addItem(newItem);
            showToast('פריט הקניות נוסף בהצלחה');
        }
        
        renderShoppingList();
        closeAllModals();
    });
    
    // רינדור ראשוני של פריטי הקניות
    renderShoppingList();
}

/**
 * הוספת פריט קניות חדש
 */
function addShoppingItem() {
    const shoppingInput = document.getElementById('shoppingInput');
    const itemText = shoppingInput.value.trim();
    
    if (itemText) {
        // איפוס הטופס
        document.getElementById('edit-shopping-form').reset();
        // הגדרת הטקסט
        document.getElementById('edit-shopping-id').value = '';
        document.getElementById('edit-shopping-text').value = itemText;
        // כיוון ערכי ברירת מחדל
        document.getElementById('edit-shopping-category').value = 'other';
        document.getElementById('edit-shopping-quantity').value = 1;
        document.getElementById('edit-shopping-completed').checked = false;
        
        // פתיחת המודאל
        openModal('edit-shopping-modal');
        // ניקוי שדה הקלט
        shoppingInput.value = '';
    }
}

/**
 * עריכת פריט קניות קיים
 * @param {Object} item - פריט הקניות לעריכה
 */
function editShoppingItem(item) {
    document.getElementById('edit-shopping-id').value = item.id;
    document.getElementById('edit-shopping-text').value = item.text;
    document.getElementById('edit-shopping-category').value = item.category || 'other';
    document.getElementById('edit-shopping-quantity').value = item.quantity || 1;
    document.getElementById('edit-shopping-notes').value = item.notes || '';
    document.getElementById('edit-shopping-completed').checked = item.completed || false;
    
    openModal('edit-shopping-modal');
}

/**
 * רינדור רשימת הקניות
 */
function renderShoppingList() {
    const shoppingList = document.getElementById('shoppingList');
    const emptyState = document.getElementById('emptyShoppingState');
    
    // קבלת פריטי הקניות
    let items = shoppingManager.getAllItems();
    
    // סינון לפי הקטגוריה
    const categoryFilter = document.getElementById('categoryFilter').value;
    if (categoryFilter !== 'all') {
        items = items.filter(item => item.category === categoryFilter);
    }
    
    // מיון הפריטים - תחילה לא הושלמו
    items.sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        // אם שניהם באותו מצב השלמה, מיין לפי קטגוריה
        if (a.category !== b.category) {
            return a.category.localeCompare(b.category);
        }
        // אם הקטגוריה זהה, מיין לפי שם הפריט
        return a.text.localeCompare(b.text);
    });
    
    // הצגת/הסתרת מצב ריק
    if (items.length === 0) {
        shoppingList.style.display = 'none';
        emptyState.style.display = 'flex';
    } else {
        shoppingList.style.display = 'block';
        emptyState.style.display = 'none';
    }
    
    // רינדור הפריטים
    shoppingList.innerHTML = '';
    
    // מעקב אחר קטגוריה נוכחית למטרת כותרות
    let currentCategory = '';
    
    items.forEach(item => {
        // אם הקטגוריה השתנתה, הוסף כותרת
        if (categoryFilter === 'all' && item.category !== currentCategory) {
            currentCategory = item.category;
            
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'category-header';
            
            // המרת קוד הקטגוריה לטקסט מתאים
            let categoryText = '';
            switch (currentCategory) {
                case 'clothing': categoryText = 'ביגוד'; break;
                case 'electronics': categoryText = 'אלקטרוניקה'; break;
                case 'toiletries': categoryText = 'טואלטיקה'; break;
                case 'gifts': categoryText = 'מתנות'; break;
                case 'food': categoryText = 'מזון'; break;
                case 'medicine': categoryText = 'תרופות'; break;
                default: categoryText = 'אחר';
            }
            
            categoryHeader.textContent = categoryText;
            shoppingList.appendChild(categoryHeader);
        }
        
        const itemElement = document.createElement('div');
        itemElement.className = `item ${item.completed ? 'completed' : ''}`;
        
        // בניית אייקון הקטגוריה
        const categoryIcon = 
            item.category === 'clothing' ? '<i class="fas fa-tshirt"></i>' :
            item.category === 'electronics' ? '<i class="fas fa-mobile-alt"></i>' :
            item.category === 'toiletries' ? '<i class="fas fa-pump-soap"></i>' :
            item.category === 'gifts' ? '<i class="fas fa-gift"></i>' :
            item.category === 'food' ? '<i class="fas fa-utensils"></i>' :
            item.category === 'medicine' ? '<i class="fas fa-pills"></i>' :
            '<i class="fas fa-shopping-bag"></i>';
        
        // טקסט כמות (אם יש יותר מאחד)
        const quantityText = item.quantity && item.quantity > 1 ? ` (${item.quantity})` : '';
        // טקסט הערות (אם קיים)
        const notesText = item.notes ? `<div class="item-notes">${item.notes}</div>` : '';
        
        // בניית תוכן הפריט
        itemElement.innerHTML = `
            <div class="checkbox ${item.completed ? 'checked' : ''}" title="${item.completed ? 'סמן כלא נרכש' : 'סמן כנרכש'}"></div>
            <div class="item-content">
                <div class="item-text">${item.text}${quantityText} ${categoryIcon}</div>
                ${notesText}
            </div>
            <div class="item-actions">
                <button class="edit-btn" title="ערוך פריט">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" title="מחק פריט">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // הוספת מאזיני אירועים
        itemElement.querySelector('.checkbox').addEventListener('click', () => {
            shoppingManager.toggleComplete(item.id);
            renderShoppingList();
        });
        
        itemElement.querySelector('.edit-btn').addEventListener('click', () => {
            editShoppingItem(item);
        });
        
        itemElement.querySelector('.delete-btn').addEventListener('click', () => {
            showDeleteConfirmation('האם אתה בטוח שברצונך למחוק את פריט הקניות הזה?', () => {
                shoppingManager.deleteItem(item.id);
                renderShoppingList();
                showToast('פריט הקניות נמחק בהצלחה');
            });
        });
        
        shoppingList.appendChild(itemElement);
    });
}

export { renderShoppingList }; 