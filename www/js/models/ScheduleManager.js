/**
 * מחלקה לניהול לו"ז ופעילויות
 */
import ItemManager from './ItemManager.js';

class ScheduleManager extends ItemManager {
    constructor() {
        super('schedule');
    }
    
    getFilteredItems(property, value) {
        return this.items.filter(item => item[property].toString() === value.toString());
    }
    
    updateItemsDay(oldDayNumber, newDayNumber) {
        this.items.forEach(item => {
            if (item.day.toString() === oldDayNumber.toString()) {
                item.day = newDayNumber;
            }
        });
        this.saveItems();
    }
    
    getActivitiesForDay(dayNumber) {
        return this.getFilteredItems('day', dayNumber);
    }
}

export default ScheduleManager; 