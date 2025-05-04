/**
 * מחלקה לניהול מסעדות ומקומות אוכל
 */
import ItemManager from './ItemManager.js';

class FoodManager extends ItemManager {
    constructor() {
        super('food');
    }
}

export default FoodManager; 