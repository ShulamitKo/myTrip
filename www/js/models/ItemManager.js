/**
 * מחלקת בסיס לניהול פריטים בלוקל סטורג'
 */
class ItemManager {
    constructor(storageKey) {
        this.storageKey = storageKey;
        this.items = this.loadItems();
    }
    
    loadItems() {
        const storedItems = localStorage.getItem(this.storageKey);
        return storedItems ? JSON.parse(storedItems) : [];
    }
    
    saveItems() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    }
    
    getAllItems() {
        return [...this.items];
    }
    
    getFilteredItems(property, value) {
        return this.items.filter(item => item[property] === value);
    }
    
    addItem(item) {
        this.items.push(item);
        this.saveItems();
    }
    
    updateItem(id, updates) {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            this.items[index] = { ...this.items[index], ...updates };
            this.saveItems();
        }
    }
    
    deleteItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveItems();
    }
    
    toggleComplete(id) {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            this.items[index].completed = !this.items[index].completed;
            this.saveItems();
        }
    }
}

// ייצוא המחלקה לשימוש בקבצים אחרים
export default ItemManager; 