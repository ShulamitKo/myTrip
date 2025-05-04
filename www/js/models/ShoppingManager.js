/**
 * מחלקה לניהול רשימת קניות
 */
import ItemManager from './ItemManager.js';

class ShoppingManager extends ItemManager {
    constructor() {
        super('shopping');
        
        // הוספת שדות חדשים לפריטים קיימים אם הם חסרים
        this.items.forEach(item => {
            if (!item.hasOwnProperty('quantity')) item.quantity = 1;
            if (!item.hasOwnProperty('notes')) item.notes = '';
        });
        this.saveItems();
    }
}

export default ShoppingManager; 