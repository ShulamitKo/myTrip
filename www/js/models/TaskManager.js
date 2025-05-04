/**
 * מחלקה לניהול משימות
 */
import ItemManager from './ItemManager.js';

class TaskManager extends ItemManager {
    constructor() {
        super('tasks');
    }
    
    getTasksForDay(day) {
        return this.items.filter(task => task.day === day);
    }
}

export default TaskManager; 