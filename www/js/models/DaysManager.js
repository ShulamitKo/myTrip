/**
 * מחלקה לניהול ימי הטיול
 */
import ItemManager from './ItemManager.js';

class DaysManager extends ItemManager {
    constructor() {
        super('days');
        // וידוא שיש ימים ברירת מחדל
        if (this.items.length === 0) {
            this.initDefaultDays();
        }
    }
    
    initDefaultDays() {
        // הוספת ימים ברירת מחדל (ימים 1-5)
        for (let i = 1; i <= 5; i++) {
            this.addItem({
                id: i.toString(),
                number: i,
                name: `יום ${i}`,
                order: i
            });
        }
    }
    
    getDays() {
        // מחזיר את הימים ממוינים לפי סדר
        return this.getAllItems().sort((a, b) => a.order - b.order);
    }
    
    addDay(dayName = null) {
        // מציאת המספר הבא לפי הימים הקיימים
        const maxNumber = Math.max(...this.getAllItems().map(day => day.number), 0);
        const newNumber = maxNumber + 1;
        
        const newDay = {
            id: Date.now().toString(),
            number: newNumber,
            name: dayName || `יום ${newNumber}`,
            order: this.getAllItems().length + 1
        };
        
        this.addItem(newDay);
        return newDay;
    }
    
    updateDayOrder(days) {
        // עדכון סדר הימים בהתאם למערך שהתקבל
        days.forEach((day, index) => {
            this.updateItem(day.id, { order: index + 1 });
        });
    }
    
    deleteDay(dayId) {
        this.deleteItem(dayId);
        // יש לעדכן מחדש את סדר הימים
        const remainingDays = this.getDays();
        this.updateDayOrder(remainingDays);
    }
    
    getDayById(dayId) {
        return this.getAllItems().find(day => day.id === dayId);
    }
    
    getDayByNumber(number) {
        return this.getAllItems().find(day => day.number.toString() === number.toString());
    }
}

export default DaysManager; 