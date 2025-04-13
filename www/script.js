document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // הוספת title לכפתורי התפריט התחתון ולשוניות העליונות
    document.querySelectorAll('.tab').forEach(tab => {
        const tabId = tab.dataset.tab;
        let tabTitle = "";
        
        switch(tabId) {
            case 'tasks': tabTitle = "עבור ללשונית משימות"; break;
            case 'shopping': tabTitle = "עבור ללשונית קניות"; break;
            case 'places': tabTitle = "עבור ללשונית מקומות"; break;
            case 'food': tabTitle = "עבור ללשונית מסעדות"; break;
            case 'schedule': tabTitle = "עבור ללשונית לו״ז"; break;
            case 'info': tabTitle = "עבור ללשונית מידע"; break;
            default: tabTitle = "עבור ללשונית"; break;
        }
        
        tab.title = tabTitle;
    });
    
    document.querySelectorAll('.nav-item').forEach(item => {
        const tabId = item.dataset.tab;
        let tabTitle = "";
        
        switch(tabId) {
            case 'tasks': tabTitle = "עבור ללשונית משימות"; break;
            case 'shopping': tabTitle = "עבור ללשונית קניות"; break;
            case 'places': tabTitle = "עבור ללשונית מקומות"; break;
            case 'food': tabTitle = "עבור ללשונית מסעדות"; break;
            case 'schedule': tabTitle = "עבור ללשונית לו״ז"; break;
            case 'info': tabTitle = "עבור ללשונית מידע"; break;
            default: tabTitle = "עבור ללשונית"; break;
        }
        
        item.title = tabTitle;
    });
    
    // מנהלי נתונים
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
    
    // מנהל משימות
    class TaskManager extends ItemManager {
        constructor() {
            super('tasks');
        }
        
        getTasksForDay(day) {
            return this.items.filter(task => task.day === day);
        }
    }
    
    // מנהל קניות
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
    
    // מנהל מקומות
    class PlaceManager extends ItemManager {
        constructor() {
            super('places');
        }
    }
    
    // מנהל מסעדות
    class FoodManager extends ItemManager {
        constructor() {
            super('food');
        }
    }
    
    // מנהל מידע
    class InfoManager extends ItemManager {
        constructor() {
            super('info');
        }
    }
    
    // מנהל לו״ז
    class ScheduleManager extends ItemManager {
        constructor() {
            super('budapestSchedule');
        }
        
        getFilteredItems(day) {
            return this.items.filter(activity => activity.day === day);
        }
    }
    
    // יצירת מנהלי נתונים
    const taskManager = new TaskManager();
    const placeManager = new PlaceManager();
    const scheduleManager = new ScheduleManager();
    const shoppingManager = new ShoppingManager();
    const foodManager = new FoodManager();
    const infoManager = new InfoManager();
    
    // אלמנטים של DOM
    // לשונית מקומות
    const placeInput = document.getElementById('place-input');
    const addPlaceBtn = document.getElementById('add-place-btn');
    const placeFilter = document.getElementById('place-filter');
    const placeList = document.getElementById('place-list');
    const emptyPlacesState = document.getElementById('empty-places-state');
    const priorityFilterBtns = document.querySelectorAll('.priority-filter-btn');
    
    // התייחסות לאלמנטים בדף
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const navItems = document.querySelectorAll('.nav-item');
    
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const emptyTasksState = document.getElementById('emptyTasksState');
    
    const shoppingInput = document.getElementById('shoppingInput');
    const addShoppingBtn = document.getElementById('addShoppingBtn');
    const shoppingList = document.getElementById('shoppingList');
    const emptyShoppingState = document.getElementById('emptyShoppingState');
    const shoppingFilter = document.getElementById('categoryFilter');
    
    const foodInput = document.getElementById('foodInput');
    const addFoodBtn = document.getElementById('addFoodBtn');
    const foodList = document.getElementById('foodList');
    const emptyFoodState = document.getElementById('emptyFoodState');
    const foodFilter = document.getElementById('foodFilter');
    const priceFilterBtns = document.querySelectorAll('.price-filter-btn');
    const ratingFilterBtns = document.querySelectorAll('.rating-filter-btn');
    
    const scheduleInput = document.getElementById('scheduleInput');
    const scheduleTime = document.getElementById('scheduleTime');
    const addScheduleBtn = document.getElementById('addScheduleBtn');
    const scheduleList = document.getElementById('scheduleList');
    const emptyScheduleState = document.getElementById('emptyScheduleState');
    const dayButtons = document.querySelectorAll('.day-btn');
    const addDayBtn = document.querySelector('.add-day-btn');
    
    const infoInput = document.getElementById('infoInput');
    const addInfoBtn = document.getElementById('addInfoBtn');
    const infoList = document.getElementById('infoList');
    
    console.log('Info elements:', { infoInput, addInfoBtn, infoList });
    
    let activeDay = '4'; // יום ברירת מחדל
    let activeFilter = 'active'; // שינוי ברירת המחדל ל'משימות פעילות'
    
    // מעבר בין לשוניות
    function switchTab(tabId) {
        console.log('Switching to tab:', tabId);
        
        // הסרת הקלאס active מכל הטאבים והתוכן
        tabs.forEach(tab => {
            const isActive = tab.classList.contains('active');
            console.log('Tab:', tab.dataset.tab, isActive);
            tab.classList.remove('active');
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
        });
        
        tabContents.forEach(content => {
            const isActive = content.classList.contains('active');
            console.log('Content:', content.id, isActive);
            content.classList.remove('active');
        });
        
        // הוספת הקלאס active לטאב הנבחר
        const selectedTab = document.querySelector(`.tab[data-tab="${tabId}"]`);
        const selectedNav = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
        const selectedContent = document.getElementById(tabId);
        
        console.log('Selected elements:', { selectedTab, selectedNav, selectedContent });
        
        if (selectedTab) {
            selectedTab.classList.add('active');
            console.log('Added active class to tab:', tabId);
        }
        if (selectedNav) {
            selectedNav.classList.add('active');
            console.log('Added active class to nav:', tabId);
        }
        if (selectedContent) {
            selectedContent.classList.add('active');
            console.log('Added active class to content:', tabId);
        }
        
        // רענון התצוגה של הטאב הנוכחי
        switch(tabId) {
            case 'tasks':
                renderTasks();
                break;
            case 'shopping':
                renderShoppingList();
                break;
            case 'places':
                renderPlaces();
                break;
            case 'food':
                renderFood();
                break;
            case 'schedule':
                renderSchedule();
                break;
            case 'info':
                renderInfo();
                break;
        }
    }
    
    // פונקציות למשימות
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const newTask = {
                id: Date.now().toString(),
                text: taskText,
                completed: false,
                priority: 'medium',
                date: new Date().toISOString()
            };
            
            taskManager.addItem(newTask);
            renderTasks();
            taskInput.value = '';
        }
    }
    
    function editTask(task) {
        document.getElementById('edit-task-id').value = task.id;
        document.getElementById('edit-task-text').value = task.text;
        document.getElementById('edit-task-priority').value = task.priority || 'medium';
        document.getElementById('edit-task-completed').checked = task.completed || false;
        
        openModal('edit-task-modal');
    }
    
    function renderTasks() {
        const tasks = taskManager.getAllItems().filter(task => {
            if (activeFilter === 'all') return true;
            if (activeFilter === 'active') return !task.completed;
            if (activeFilter === 'completed') return task.completed;
            if (activeFilter === 'high') return task.priority === 'high';
            return true;
        });
        
        // מיון המשימות - קודם לפי עדיפות ואז לפי תאריך היצירה
        tasks.sort((a, b) => {
            // מיון לפי עדיפות (גבוהה -> בינונית -> נמוכה)
            const priorityValues = { 'high': 3, 'medium': 2, 'low': 1 };
            const priorityDiff = priorityValues[b.priority] - priorityValues[a.priority];
            
            if (priorityDiff !== 0) {
                return priorityDiff; // אם העדיפויות שונות, מיין לפי עדיפות
            }
            
            // במקרה של עדיפות זהה, מיין לפי תאריך היצירה (חדש למעלה)
            return new Date(b.date) - new Date(a.date);
        });
        
        if (tasks.length === 0) {
            taskList.style.display = 'none';
            emptyTasksState.style.display = 'block';
        } else {
            taskList.style.display = 'block';
            emptyTasksState.style.display = 'none';
            
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
                taskItem.dataset.priority = task.priority;
                
                const priorityIcon = 
                    task.priority === 'high' ? '<i class="fas fa-exclamation-circle"></i>' :
                    task.priority === 'medium' ? '<i class="fas fa-circle"></i>' :
                    '<i class="fas fa-arrow-circle-down"></i>';
                
                taskItem.innerHTML = `
                    <div class="task-content">
                        <div class="checkbox ${task.completed ? 'checked' : ''}" title="${task.completed ? 'סמן כלא הושלם' : 'סמן כהושלם'}"></div>
                        <div class="task-priority ${task.priority}">${priorityIcon}</div>
                        <div class="task-text">${task.text}</div>
                    </div>
                    <div class="task-actions">
                        <div class="task-action priority-action" data-id="${task.id}" title="שנה עדיפות">
                            <i class="fas fa-flag"></i>
                        </div>
                        <div class="task-action edit-action" data-id="${task.id}" title="ערוך משימה">
                            <i class="fas fa-edit"></i>
                        </div>
                        <div class="task-action delete-action" data-id="${task.id}" title="מחק משימה">
                            <i class="fas fa-trash-alt"></i>
                        </div>
                    </div>
                `;
                
                const checkbox = taskItem.querySelector('.checkbox');
                checkbox.addEventListener('click', () => {
                    taskManager.toggleComplete(task.id);
                    renderTasks();
                });
                
                const priorityAction = taskItem.querySelector('.priority-action');
                priorityAction.addEventListener('click', () => {
                    const priorities = ['low', 'medium', 'high'];
                    const currentIndex = priorities.indexOf(task.priority);
                    const nextIndex = (currentIndex + 1) % priorities.length;
                    
                    taskManager.updateItem(task.id, { priority: priorities[nextIndex] });
                    renderTasks();
                });
                
                const editAction = taskItem.querySelector('.edit-action');
                editAction.addEventListener('click', () => {
                    editTask(task);
                });
                
                const deleteAction = taskItem.querySelector('.delete-action');
                deleteAction.addEventListener('click', () => {
                    if (confirm('האם אתה בטוח שברצונך למחוק את המשימה?')) {
                        taskManager.deleteItem(task.id);
                        renderTasks();
                    }
                });
                
                // הוספת אירוע לחיצה על המשימה עצמה
                const taskText = taskItem.querySelector('.task-text');
                taskText.addEventListener('click', () => {
                    editTask(task);
                });
                
                taskList.appendChild(taskItem);
            });
        }
    }
    
    // פונקציות לרשימת קניות
    function addShoppingItem() {
        const itemText = shoppingInput.value.trim();
        if (itemText) {
            document.getElementById('edit-shopping-form').reset();
            document.getElementById('edit-shopping-id').value = '';
            document.getElementById('edit-shopping-text').value = itemText;
            openModal('edit-shopping-modal');
            shoppingInput.value = '';
        }
    }
    
    function renderShoppingList() {
        const selectedCategory = shoppingFilter.value;
        const items = selectedCategory === 'all' ? 
                      shoppingManager.getAllItems() : 
                      shoppingManager.getFilteredItems('category', selectedCategory);
        
        if (items.length === 0) {
            shoppingList.style.display = 'none';
            emptyShoppingState.style.display = 'block';
        } else {
            shoppingList.style.display = 'block';
            emptyShoppingState.style.display = 'none';
            
            shoppingList.innerHTML = '';
            items.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = `item ${item.completed ? 'completed' : ''}`;
                
                const categoryIcon = 
                    item.category === 'clothing' ? '<i class="fas fa-tshirt"></i>' :
                    item.category === 'electronics' ? '<i class="fas fa-mobile-alt"></i>' :
                    item.category === 'toiletries' ? '<i class="fas fa-pump-soap"></i>' :
                    item.category === 'gifts' ? '<i class="fas fa-gift"></i>' :
                    item.category === 'food' ? '<i class="fas fa-utensils"></i>' :
                    item.category === 'medicine' ? '<i class="fas fa-pills"></i>' :
                    '<i class="fas fa-shopping-bag"></i>';
                
                const quantityText = item.quantity && item.quantity > 1 ? ` (${item.quantity})` : '';
                const notesText = item.notes ? `<div class="item-notes">${item.notes}</div>` : '';
                
                itemEl.innerHTML = `
                    <div class="checkbox ${item.completed ? 'checked' : ''}" title="${item.completed ? 'סמן כלא נרכש' : 'סמן כנרכש'}"></div>
                    <div class="item-content">
                        <div class="item-text">${item.text}${quantityText} ${categoryIcon}</div>
                        ${notesText}
                    </div>
                    <div class="item-actions">
                        <button class="edit-btn" title="ערוך פריט"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn" title="מחק פריט"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
                
                const checkbox = itemEl.querySelector('.checkbox');
                checkbox.addEventListener('click', () => {
                    shoppingManager.toggleComplete(item.id);
                    renderShoppingList();
                });
                
                const editBtn = itemEl.querySelector('.edit-btn');
                editBtn.addEventListener('click', () => {
                    editShoppingItem(item);
                });
                
                const deleteBtn = itemEl.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', () => {
                    if (confirm('האם אתה בטוח שברצונך למחוק את הפריט?')) {
                        shoppingManager.deleteItem(item.id);
                        renderShoppingList();
                    }
                });
                
                shoppingList.appendChild(itemEl);
            });
        }
    }
    
    function editShoppingItem(item) {
        document.getElementById('edit-shopping-id').value = item.id;
        document.getElementById('edit-shopping-text').value = item.text;
        document.getElementById('edit-shopping-category').value = item.category || 'other';
        document.getElementById('edit-shopping-quantity').value = item.quantity || 1;
        document.getElementById('edit-shopping-notes').value = item.notes || '';
        document.getElementById('edit-shopping-completed').checked = item.completed || false;
        
        openModal('edit-shopping-modal');
    }
    
    // פונקציות למקומות ביקור
    function addPlace() {
        const placeText = placeInput.value.trim();
        if (placeText) {
            document.getElementById('edit-place-form').reset();
            document.getElementById('edit-place-id').value = '';
            document.getElementById('edit-place-name').value = placeText;
            openModal('edit-place-modal');
            placeInput.value = '';
        }
    }
    
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
    
    function renderPlaces() {
        const selectedCategory = placeFilter.value;
        // במקום להשתמש ב-selectedPriority, אנו נאסוף את כל העדיפויות הפעילות
        const activePriorities = [];
        document.querySelectorAll('.priority-filter-btn.active').forEach(btn => {
            activePriorities.push(btn.dataset.priority);
        });
        
        // סינון לפי קטגוריה
        let places = selectedCategory === 'all' ? 
                    placeManager.getAllItems() : 
                    placeManager.getFilteredItems('category', selectedCategory);
        
        // סינון לפי עדיפויות פעילות
        if (activePriorities.length > 0 && activePriorities.length < 3) {
            places = places.filter(place => activePriorities.includes(place.priority));
        }
        
        if (places.length === 0) {
            placeList.style.display = 'none';
            emptyPlacesState.style.display = 'block';
        } else {
            placeList.style.display = 'block';
            emptyPlacesState.style.display = 'none';
            
            placeList.innerHTML = '';
            places.forEach(place => {
                const categoryIcon = 
                    place.category === 'attraction' ? '<i class="fas fa-monument"></i>' :
                    place.category === 'museum' ? '<i class="fas fa-landmark"></i>' :
                    place.category === 'food' ? '<i class="fas fa-utensils"></i>' :
                    place.category === 'nature' ? '<i class="fas fa-tree"></i>' :
                    '<i class="fas fa-map-marker-alt"></i>';
                
                const priorityIcon = 
                    place.priority === 'high' ? '<i class="fas fa-exclamation-circle"></i>' :
                    place.priority === 'medium' ? '<i class="fas fa-circle"></i>' :
                    '<i class="fas fa-arrow-circle-down"></i>';
                
                const placeCard = document.createElement('div');
                placeCard.className = `place-card ${place.visited ? 'visited' : ''}`;
                
                placeCard.innerHTML = `
                    <div class="place-header">
                        <div class="place-main-info">
                            <div class="place-name">${place.name}</div>
                            <div class="place-meta">
                                <div class="place-tags">
                                    <span class="priority-tag ${place.priority}">
                                        ${priorityIcon}
                                        <span class="tag-text">
                                            ${place.priority === 'high' ? 'עדיפות גבוהה' : 
                                              place.priority === 'medium' ? 'עדיפות בינונית' : 'עדיפות נמוכה'}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <span class="category-tag ${place.category}">
                            ${categoryIcon}
                            <span class="tag-text">
                                ${place.category === 'attraction' ? 'אטרקציה' :
                                  place.category === 'museum' ? 'מוזיאון' :
                                  place.category === 'food' ? 'אוכל' :
                                  place.category === 'nature' ? 'טבע' : 'אחר'}
                            </span>
                        </span>
                    </div>
                    <div class="place-body">
                        ${place.address ? `<div class="place-address"><i class="fas fa-map-marker-alt"></i> ${place.address}</div>` : ''}
                        ${place.notes ? `<div class="place-notes">${place.notes}</div>` : ''}
                    </div>
                    <div class="place-footer">
                        <button class="place-action visit-action ${place.visited ? 'visited' : ''}" title="${place.visited ? 'סמן כלא ביקרתי' : 'סמן כביקרתי'}">
                            <i class="fas ${place.visited ? 'fa-check-circle' : 'fa-circle'}"></i>
                            <span class="action-text">${place.visited ? 'ביקרתי' : 'טרם ביקרתי'}</span>
                        </button>
                        ${place.address ? `
                            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}" 
                               target="_blank" class="place-action map-action" title="פתח את המיקום בגוגל מפס (ייפתח בחלון חדש)">
                               <i class="fas fa-map-marked-alt"></i>
                               <span class="action-text">מפה</span>
                            </a>
                        ` : ''}
                        <button class="place-action edit-action" title="ערוך פרטים">
                            <i class="fas fa-edit"></i>
                            <span class="action-text">עריכה</span>
                        </button>
                        <button class="place-action delete-action" title="מחק מקום">
                            <i class="fas fa-trash-alt"></i>
                            <span class="action-text">מחיקה</span>
                        </button>
                    </div>
                `;
                
                const visitAction = placeCard.querySelector('.visit-action');
                visitAction.addEventListener('click', () => {
                    place.visited = !place.visited;
                    placeManager.updateItem(place.id, { visited: place.visited });
                    renderPlaces();
                });
                
                const editAction = placeCard.querySelector('.edit-action');
                editAction.addEventListener('click', () => {
                    editPlace(place);
                });
                
                const deleteAction = placeCard.querySelector('.delete-action');
                deleteAction.addEventListener('click', () => {
                    if (confirm('האם אתה בטוח שברצונך למחוק את המקום?')) {
                        placeManager.deleteItem(place.id);
                        renderPlaces();
                    }
                });
                
                placeList.appendChild(placeCard);
            });
        }
    }
    
    // פונקציות ללו"ז היומי
    function addScheduleItem() {
        const scheduleText = scheduleInput.value.trim();
        const timeValue = scheduleTime.value;
        
        if (scheduleText && timeValue) {
            const newItem = {
                id: Date.now().toString(),
                text: scheduleText,
                time: timeValue,
                day: activeDay,
                completed: false,
                category: 'general'
            };
            
            scheduleManager.addItem(newItem);
            renderSchedule();
            
            scheduleInput.value = '';
            scheduleTime.value = '';
        }
    }
    
    function editScheduleItem(activity) {
        scheduleTime.value = activity.time;
        scheduleInput.value = activity.text;
        
        // שינוי כפתור ההוספה לכפתור שמירה
        const addButton = document.getElementById('addScheduleBtn');
        addButton.innerHTML = '<i class="fas fa-save"></i>';
        addButton.classList.add('editing');
        
        // שמירת ה-ID של הפעילות הנוכחית
        addButton.dataset.editingId = activity.id;
        
        // החלפת אירוע הלחיצה לפונקציית העריכה
        const saveHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (scheduleTime.value && scheduleInput.value) {
                // עדכון הפריט הקיים
                scheduleManager.updateItem(activity.id, {
                    time: scheduleTime.value,
                    text: scheduleInput.value.trim(),
                    day: activeDay
                });
                
                // איפוס הטופס
                scheduleTime.value = '';
                scheduleInput.value = '';
                addButton.innerHTML = '<i class="fas fa-plus"></i>';
                addButton.classList.remove('editing');
                delete addButton.dataset.editingId;
                
                // הסרת אירועי העריכה
                addButton.removeEventListener('click', saveHandler);
                scheduleInput.removeEventListener('keypress', enterHandler);
                
                renderSchedule();
            }
        };
        
        const enterHandler = (e) => {
            if (e.key === 'Enter') {
                saveHandler(e);
            }
        };
        
        // הוספת מאזין אירועים לשמירה
        addButton.addEventListener('click', saveHandler);
        scheduleInput.addEventListener('keypress', enterHandler);
        
        // הוספת אירוע ביטול בלחיצה על Escape
        const handleEscape = (e) => {
            if (e.key === 'Escape' && addButton.classList.contains('editing')) {
                scheduleTime.value = '';
                scheduleInput.value = '';
                addButton.innerHTML = '<i class="fas fa-plus"></i>';
                addButton.classList.remove('editing');
                delete addButton.dataset.editingId;
                
                // הסרת אירועי העריכה
                addButton.removeEventListener('click', saveHandler);
                scheduleInput.removeEventListener('keypress', enterHandler);
                document.removeEventListener('keydown', handleEscape);
            }
        };
        
        document.addEventListener('keydown', handleEscape);
    }
    
    function renderSchedule() {
        const activities = scheduleManager.getFilteredItems('day', activeDay);
        activities.sort((a, b) => a.time.localeCompare(b.time));
        
        if (activities.length === 0) {
            scheduleList.style.display = 'none';
            emptyScheduleState.style.display = 'block';
        } else {
            scheduleList.style.display = 'block';
            emptyScheduleState.style.display = 'none';
            
            scheduleList.innerHTML = '';
            activities.forEach(activity => {
                const timeBlock = document.createElement('div');
                timeBlock.className = `time-block ${activity.completed ? 'completed' : ''}`;
                
                timeBlock.innerHTML = `
                    <div class="time-block-time">
                        ${activity.time}
                    </div>
                    <div class="time-block-content">
                        <div class="time-block-text">${activity.text}</div>
                        ${activity.notes ? `<div class="time-block-notes">${activity.notes}</div>` : ''}
                    </div>
                    <div class="time-block-actions">
                        <button class="time-block-btn complete" title="${activity.completed ? 'סמן כלא הושלם' : 'סמן כהושלם'}">
                            <i class="fas ${activity.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
                        </button>
                        <button class="time-block-btn edit" title="ערוך פעילות">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="time-block-btn delete" title="מחק פעילות">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                `;
                
                const completeBtn = timeBlock.querySelector('.time-block-btn.complete');
                completeBtn.addEventListener('click', () => {
                    scheduleManager.updateItem(activity.id, { completed: !activity.completed });
                    renderSchedule();
                });
                
                const editBtn = timeBlock.querySelector('.time-block-btn.edit');
                editBtn.addEventListener('click', () => {
                    editScheduleItem(activity);
                });
                
                const deleteBtn = timeBlock.querySelector('.time-block-btn.delete');
                deleteBtn.addEventListener('click', () => {
                    if (confirm('האם אתה בטוח שברצונך למחוק את הפעילות?')) {
                        scheduleManager.deleteItem(activity.id);
                        renderSchedule();
                    }
                });
                
                scheduleList.appendChild(timeBlock);
            });
        }
    }
    
    // פונקציות עזר ללו"ז
    function calculateEndTime(startTime, duration) {
        const [hours, minutes] = startTime.split(':');
        const date = new Date();
        date.setHours(parseInt(hours));
        date.setMinutes(parseInt(minutes) + parseInt(duration));
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }
    
    function formatTime(time) {
        return time;
    }
    
    function formatDuration(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours === 0) {
            return `${mins} דקות`;
        } else if (mins === 0) {
            return `${hours} שעות`;
        }
        return `${hours} שעות ו-${mins} דקות`;
    }
    
    // פונקציות עזר
    function openModal(modalId) {
        console.log('Opening modal:', modalId);
        closeAllModals(); // סגירת כל המודלים הפתוחים

        const modal = document.getElementById(modalId);
        console.log('Modal element:', modal);

        if (modal) {
            modal.classList.add('show');
            
            // הוספת title לכפתורי סגירה וביטול
            const closeButtons = modal.querySelectorAll('.close-btn, .close-modal');
            closeButtons.forEach(button => {
                button.title = "סגור";
                button.addEventListener('click', () => {
                    console.log('Close button clicked');
                    modal.classList.remove('show');
                });
            });

            // הוספת title לכפתורי ביטול ושמירה
            const submitButton = modal.querySelector('button[type="submit"]');
            if (submitButton) submitButton.title = "שמור שינויים";
            
            const cancelButtons = modal.querySelectorAll('button[type="button"].btn:not(.primary-btn)');
            cancelButtons.forEach(button => {
                button.title = "בטל שינויים";
                button.addEventListener('click', () => {
                    console.log('Cancel button clicked');
                    modal.classList.remove('show');
                });
            });

            // סגירת המודל בלחיצה מחוץ לתוכן
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    console.log('Clicked outside modal');
                    modal.classList.remove('show');
                }
            });
        } else {
            console.error('Modal not found:', modalId);
        }
    }

    function closeAllModals() {
        console.log('Closing all modals');
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('show');
        });
    }
    
    // אירועי לחיצה
    tabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
    
    navItems.forEach(item => {
        item.addEventListener('click', () => switchTab(item.dataset.tab));
    });
    
    // הוספת title לכפתורי ההוספה
    document.getElementById('addTaskBtn').title = "הוסף משימה חדשה";
    document.getElementById('addShoppingBtn').title = "הוסף פריט לרשימת הקניות";
    document.getElementById('add-place-btn').title = "הוסף מקום חדש";
    document.getElementById('addFoodBtn').title = "הוסף מסעדה או מקום אוכל";
    document.getElementById('addInfoBtn').title = "הוסף מידע חדש";
    document.getElementById('addScheduleBtn').title = "הוסף פעילות ללו״ז";
    document.querySelector('.add-day-btn').title = "הוסף יום חדש";
    document.getElementById('settingsBtn').title = "הגדרות";
    
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    
    // הוספת title לכפתורי הסינון ולכפתורי היום
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const filterType = btn.dataset.filter;
        let titleText = "";
        
        switch(filterType) {
            case 'all': titleText = "הצג את כל המשימות"; break;
            case 'active': titleText = "הצג רק משימות פעילות"; break;
            case 'completed': titleText = "הצג רק משימות שהושלמו"; break;
            case 'high': titleText = "הצג משימות בעדיפות גבוהה"; break;
            default: titleText = "סנן משימות";
        }
        
        btn.title = titleText;
    });
    
    dayButtons.forEach(btn => {
        const day = btn.dataset.day;
        btn.title = `הצג לו"ז ליום ${day}`;
    });
    
    // מאזיני אירועים לסינון משימות
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            renderTasks();
        });
    });
    
    dayButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            dayButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeDay = btn.dataset.day;
            renderSchedule();
        });
    });
    
    addShoppingBtn.addEventListener('click', addShoppingItem);
    shoppingInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addShoppingItem();
    });
    
    // מאזין אירועים לשינוי קטגוריה בקניות
    shoppingFilter.addEventListener('change', renderShoppingList);
    
    addPlaceBtn.addEventListener('click', addPlace);
    placeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addPlace();
    });
    
    addFoodBtn.addEventListener('click', addFood);
    foodInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addFood();
    });
    
    addInfoBtn.addEventListener('click', addInfo);
    infoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addInfo();
    });
    
    addScheduleBtn.addEventListener('click', (e) => {
        if (addScheduleBtn.classList.contains('editing')) {
            return; // אם נמצאים במצב עריכה, לא להפעיל את פונקציית ההוספה
        }
        addScheduleItem();
    });
    
    // טיפול בטפסים
    document.getElementById('edit-task-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const taskId = document.getElementById('edit-task-id').value;
        const updatedTask = {
            text: document.getElementById('edit-task-text').value,
            priority: document.getElementById('edit-task-priority').value,
            completed: document.getElementById('edit-task-completed').checked
        };
        
        if (taskId) {
            // שומר על התאריך המקורי של המשימה בעת עדכון
            const originalTask = taskManager.getAllItems().find(task => task.id === taskId);
            if (originalTask && originalTask.date) {
                updatedTask.date = originalTask.date;
            } else {
                updatedTask.date = new Date().toISOString();
            }
            
            taskManager.updateItem(taskId, updatedTask);
        } else {
            taskManager.addItem({
                id: Date.now().toString(),
                date: new Date().toISOString(),
                ...updatedTask
            });
        }
        
        renderTasks();
        closeAllModals();
    });
    
    document.getElementById('edit-shopping-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const itemId = document.getElementById('edit-shopping-id').value;
        const updatedItem = {
            text: document.getElementById('edit-shopping-text').value,
            category: document.getElementById('edit-shopping-category').value,
            quantity: parseInt(document.getElementById('edit-shopping-quantity').value) || 1,
            notes: document.getElementById('edit-shopping-notes').value,
            completed: document.getElementById('edit-shopping-completed').checked
        };
        
        if (itemId) {
            shoppingManager.updateItem(itemId, updatedItem);
        } else {
            shoppingManager.addItem({
                id: Date.now().toString(),
                ...updatedItem
            });
        }
        
        renderShoppingList();
        closeAllModals();
    });
    
    document.getElementById('edit-place-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const placeId = document.getElementById('edit-place-id').value;
        const updatedPlace = {
            name: document.getElementById('edit-place-name').value,
            address: document.getElementById('edit-place-address').value,
            notes: document.getElementById('edit-place-notes').value,
            category: document.getElementById('edit-place-category').value,
            priority: document.getElementById('edit-place-priority').value,
            visited: document.getElementById('edit-place-visited').checked
        };
        
        if (placeId) {
            placeManager.updateItem(placeId, updatedPlace);
        } else {
            placeManager.addItem({
                id: Date.now().toString(),
                ...updatedPlace
            });
        }
        
        renderPlaces();
        closeAllModals();
    });
    
    // סגירת מודאלים
    document.querySelectorAll('.close-btn, .close-modal').forEach(button => {
        button.addEventListener('click', () => {
            closeAllModals();
        });
    });

    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // הוספת נתוני דוגמה
   
    
    // עדכון הטופס של עריכת מסעדה
    document.getElementById('edit-food-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const foodId = document.getElementById('edit-food-id').value;
        const updatedFood = {
            name: document.getElementById('edit-food-name').value,
            address: document.getElementById('edit-food-address').value,
            notes: document.getElementById('edit-food-notes').value,
            category: document.getElementById('edit-food-category').value,
            price: document.getElementById('edit-food-price').value,
            rating: parseInt(document.getElementById('edit-food-rating').value) || 0,
            visited: document.getElementById('edit-food-visited').checked
        };
        
        if (foodId) {
            foodManager.updateItem(foodId, updatedFood);
        } else {
            foodManager.addItem({
                id: Date.now().toString(),
                ...updatedFood
            });
        }
        
        renderFood();
        closeAllModals();
    });

    // פונקציות למסעדות
    function addFood() {
        const foodName = foodInput.value.trim();
        if (foodName) {
            document.getElementById('edit-food-form').reset();
            document.getElementById('edit-food-id').value = '';
            document.getElementById('edit-food-name').value = foodName;
            document.getElementById('edit-food-category').value = 'restaurant';
            document.getElementById('edit-food-price').value = 'medium';
            document.getElementById('edit-food-rating').value = '0';
            document.getElementById('edit-food-visited').checked = false;
            openModal('edit-food-modal');
            foodInput.value = '';
        }
    }

    function editFood(food) {
        document.getElementById('edit-food-id').value = food.id;
        document.getElementById('edit-food-name').value = food.name;
        document.getElementById('edit-food-address').value = food.address || '';
        document.getElementById('edit-food-category').value = food.category || 'restaurant';
        document.getElementById('edit-food-price').value = food.price || 'medium';
        document.getElementById('edit-food-rating').value = food.rating || '0';
        document.getElementById('edit-food-notes').value = food.notes || '';
        document.getElementById('edit-food-visited').checked = food.visited || false;
        
        openModal('edit-food-modal');
    }

    function renderFood() {
        const selectedCategory = foodFilter.value;
        
        // אוסף את כל אפשרויות המחיר הפעילות
        const activePrices = [];
        document.querySelectorAll('.price-filter-btn.active').forEach(btn => {
            activePrices.push(btn.dataset.price);
        });
        
        // מקבל את הדירוג המינימלי הנדרש
        let minRating = 0;
        const activeRatingBtn = document.querySelector('.rating-filter-btn.active');
        if (activeRatingBtn) {
            minRating = parseInt(activeRatingBtn.dataset.rating) || 0;
        }
        
        // סינון לפי קטגוריה
        let foods = selectedCategory === 'all' ? 
                      foodManager.getAllItems() : 
                      foodManager.getFilteredItems('category', selectedCategory);
        
        // סינון לפי מחיר
        if (activePrices.length > 0 && activePrices.length < 3) {
            foods = foods.filter(food => activePrices.includes(food.price));
        }
        
        // סינון לפי דירוג
        if (minRating > 0) {
            foods = foods.filter(food => {
                const rating = parseInt(food.rating) || 0;
                return rating >= minRating;
            });
        }
        
        if (foods.length === 0) {
            foodList.style.display = 'none';
            emptyFoodState.style.display = 'block';
        } else {
            foodList.style.display = 'block';
            emptyFoodState.style.display = 'none';
            
            foodList.innerHTML = '';
            foods.forEach(food => {
                const categoryIcon = 
                    food.category === 'restaurant' ? '<i class="fas fa-utensils"></i>' :
                    food.category === 'cafe' ? '<i class="fas fa-coffee"></i>' :
                    food.category === 'fastfood' ? '<i class="fas fa-hamburger"></i>' :
                    food.category === 'dessert' ? '<i class="fas fa-ice-cream"></i>' :
                    food.category === 'local' ? '<i class="fas fa-pepper-hot"></i>' :
                    '<i class="fas fa-concierge-bell"></i>';
                
                const priceIcon = 
                    food.price === 'cheap' ? '<i class="fas fa-dollar-sign"></i>' :
                    food.price === 'medium' ? '<i class="fas fa-dollar-sign"></i><i class="fas fa-dollar-sign"></i>' :
                    '<i class="fas fa-dollar-sign"></i><i class="fas fa-dollar-sign"></i><i class="fas fa-dollar-sign"></i>';
                
                // יצירת הצגה ויזואלית של הדירוג עם כוכבים
                let ratingStars = '';
                const rating = parseInt(food.rating) || 0;
                
                for (let i = 1; i <= 5; i++) {
                    if (i <= rating) {
                        ratingStars += '<i class="fas fa-star"></i>'; // כוכב מלא
                    } else {
                        ratingStars += '<i class="far fa-star"></i>'; // כוכב ריק
                    }
                }
                
                const foodCard = document.createElement('div');
                foodCard.className = `food-card ${food.visited ? 'visited' : ''}`;
                
                foodCard.innerHTML = `
                    <div class="food-header">
                        <div class="food-main-info">
                            <div class="food-name">${food.name}</div>
                            <div class="food-meta">
                                <div class="food-tags">
                                    <span class="category-tag ${food.category}">
                                        ${categoryIcon}
                                        <span class="tag-text">
                                            ${food.category === 'restaurant' ? 'מסעדה' :
                                              food.category === 'cafe' ? 'בית קפה' :
                                              food.category === 'fastfood' ? 'מזון מהיר' :
                                              food.category === 'dessert' ? 'קינוחים' :
                                              food.category === 'local' ? 'מקומי' : 'אחר'}
                                        </span>
                                    </span>
                                    <span class="price-tag ${food.price}">
                                        ${priceIcon}
                                        <span class="tag-text">
                                            ${food.price === 'cheap' ? 'זול' :
                                              food.price === 'medium' ? 'בינוני' : 'יקר'}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="food-body">
                        ${rating > 0 ? `<div class="food-rating" title="דירוג: ${rating} מתוך 5">${ratingStars}</div>` : ''}
                        ${food.address ? `<div class="food-address"><i class="fas fa-map-marker-alt"></i> ${food.address}</div>` : ''}
                        ${food.notes ? `<div class="food-notes">${food.notes}</div>` : ''}
                    </div>
                    <div class="food-footer">
                        <button class="food-action visit-action ${food.visited ? 'visited' : ''}" title="${food.visited ? 'סמן כלא ביקרתי' : 'סמן כביקרתי'}">
                            <i class="fas ${food.visited ? 'fa-check-circle' : 'fa-circle'}"></i>
                            <span class="action-text">${food.visited ? 'ביקרתי' : 'טרם ביקרתי'}</span>
                        </button>
                        ${food.address ? `
                            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(food.address)}" 
                               target="_blank" class="food-action map-action" title="פתח את המיקום בגוגל מפס (ייפתח בחלון חדש)">
                               <i class="fas fa-map-marked-alt"></i>
                               <span class="action-text">מפה</span>
                            </a>
                        ` : ''}
                        <button class="food-action edit-action" title="ערוך פרטים">
                            <i class="fas fa-edit"></i>
                            <span class="action-text">עריכה</span>
                        </button>
                        <button class="food-action delete-action" title="מחק מסעדה">
                            <i class="fas fa-trash-alt"></i>
                            <span class="action-text">מחיקה</span>
                        </button>
                    </div>
                `;
                
                const visitAction = foodCard.querySelector('.visit-action');
                visitAction.addEventListener('click', () => {
                    food.visited = !food.visited;
                    foodManager.updateItem(food.id, { visited: food.visited });
                    renderFood();
                });
                
                const editAction = foodCard.querySelector('.edit-action');
                editAction.addEventListener('click', () => {
                    editFood(food);
                });
                
                const deleteAction = foodCard.querySelector('.delete-action');
                deleteAction.addEventListener('click', () => {
                    if (confirm('האם אתה בטוח שברצונך למחוק את המסעדה?')) {
                        foodManager.deleteItem(food.id);
                        renderFood();
                    }
                });
                
                foodList.appendChild(foodCard);
            });
        }
    }

    // אירועי לחיצה למסעדות
    addFoodBtn.addEventListener('click', addFood);
    foodInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addFood();
    });
    
    foodFilter.addEventListener('change', renderFood);
    
    // מאזיני אירועים לכפתורי סינון מחיר
    priceFilterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // החלפת מצב הכפתור (פעיל/לא פעיל)
            this.classList.toggle('active');
            renderFood();
            
            // בדיקה אם אין כפתורים פעילים, במקרה כזה נפעיל את כולם
            const activeBtns = document.querySelectorAll('.price-filter-btn.active');
            if (activeBtns.length === 0) {
                priceFilterBtns.forEach(b => b.classList.add('active'));
                renderFood();
            }
        });
    });
    
    // מאזיני אירועים לכפתורי סינון דירוג
    ratingFilterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // ביטול פעיל מכל הכפתורים
            ratingFilterBtns.forEach(b => b.classList.remove('active'));
            // הפעלת הכפתור הנוכחי
            this.classList.add('active');
            renderFood();
        });
    });
    
    // הוספת מאזין אירועים לפילטר מקומות
    placeFilter.addEventListener('change', renderPlaces);
    
    // הוספת מאזין אירועים למיון לפי עדיפות
    priorityFilterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // החלפת מצב הכפתור (פעיל/לא פעיל)
            this.classList.toggle('active');
            renderPlaces();
            
            // בדיקה אם אין כפתורים פעילים, במקרה כזה נפעיל את כולם
            const activeBtns = document.querySelectorAll('.priority-filter-btn.active');
            if (activeBtns.length === 0) {
                priorityFilterBtns.forEach(b => b.classList.add('active'));
                renderPlaces();
            }
        });
    });
    
    // רנדור התצוגה הראשונית
    renderTasks();
    renderShoppingList();
    renderPlaces();
    renderSchedule();
    renderFood();
    renderInfo();

    // וידוא שהטאב הנכון פעיל בטעינת הדף
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter === activeFilter) {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        }
    });

    // טיפול בטפס עריכת לו"ז
    document.getElementById('edit-schedule-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const itemId = document.getElementById('edit-schedule-id').value;
        const updatedActivity = {
            text: document.getElementById('edit-schedule-text').value,
            time: document.getElementById('edit-schedule-time').value,
            duration: document.getElementById('edit-schedule-duration').value,
            category: document.getElementById('edit-schedule-category').value,
            location: document.getElementById('edit-schedule-location').value,
            notes: document.getElementById('edit-schedule-notes').value,
            completed: document.getElementById('edit-schedule-completed').checked,
            day: activeDay
        };
        
        if (itemId) {
            scheduleManager.updateItem(itemId, updatedActivity);
        } else {
            scheduleManager.addItem({
                id: Date.now().toString(),
                ...updatedActivity
            });
        }
        
        renderSchedule();
        closeAllModals();
    });

    // פונקציות למידע
    function addInfo() {
        const title = infoInput.value.trim();
        if (title) {
            document.getElementById('edit-info-form').reset();
            document.getElementById('edit-info-id').value = '';
            document.getElementById('edit-info-title').value = title;
            document.getElementById('edit-info-content').value = '';
            document.getElementById('edit-info-icon').value = 'info-circle';
            openModal('edit-info-modal');
            infoInput.value = '';
        }
    }

    function editInfo(info) {
        document.getElementById('edit-info-id').value = info.id;
        document.getElementById('edit-info-title').value = info.title;
        document.getElementById('edit-info-content').value = info.content;
        document.getElementById('edit-info-icon').value = info.icon || 'info-circle';
        
        openModal('edit-info-modal');
    }

    function renderInfo() {
        const items = infoManager.getAllItems();
        const infoList = document.getElementById('infoList');
        const emptyState = document.getElementById('emptyInfoState');
        
        if (items.length === 0) {
            infoList.style.display = 'none';
            emptyState.style.display = 'block';
        } else {
            infoList.style.display = 'block';
            emptyState.style.display = 'none';
            
            infoList.innerHTML = '';
            items.forEach(info => {
                const infoCard = document.createElement('div');
                infoCard.className = 'info-card';
                
                infoCard.innerHTML = `
                    <div class="info-header">
                        <div class="info-main-info">
                            <div class="info-title">
                                <i class="fas fa-${info.icon}"></i>
                                ${info.title}
                            </div>
                        </div>
                        <div class="info-actions">
                            <button class="info-action edit-action" title="ערוך מידע">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="info-action delete-action" title="מחק מידע">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="info-content">
                        <p>${info.content}</p>
                    </div>
                `;
                
                const editAction = infoCard.querySelector('.edit-action');
                editAction.addEventListener('click', () => {
                    editInfo(info);
                });
                
                const deleteAction = infoCard.querySelector('.delete-action');
                deleteAction.addEventListener('click', () => {
                    if (confirm('האם אתה בטוח שברצונך למחוק את המידע?')) {
                        infoManager.deleteItem(info.id);
                        renderInfo();
                    }
                });
                
                infoList.appendChild(infoCard);
            });
        }
    }

    // אירועי לחיצה למידע
    addInfoBtn.addEventListener('click', addInfo);
    infoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addInfo();
    });

    // טיפול בטופס המידע
    document.getElementById('edit-info-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const infoId = document.getElementById('edit-info-id').value;
        const updatedInfo = {
            title: document.getElementById('edit-info-title').value.trim(),
            content: document.getElementById('edit-info-content').value.trim(),
            icon: document.getElementById('edit-info-icon').value
        };
        
        if (infoId) {
            infoManager.updateItem(infoId, updatedInfo);
        } else {
            infoManager.addItem({
                id: Date.now().toString(),
                ...updatedInfo
            });
        }
        
        closeAllModals();
        renderInfo();
    });

    // סגירת מודל המידע
    const infoModal = document.getElementById('edit-info-modal');
    if (infoModal) {
        const closeBtn = infoModal.querySelector('.close-btn');
        const closeModalBtn = infoModal.querySelector('.close-modal');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                closeAllModals();
            });
        }
        
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                closeAllModals();
            });
        }
    }

    // הוספת נתוני דוגמה למידע
    if (infoManager.getAllItems().length === 0) {
        const sampleInfo = [
            {
                id: '1',
                title: 'טיפים לטיול בבודפסט',
                content: `
                    <p><i class="fas fa-money-bill-wave"></i> המטבע המקומי: פורינט הונגרי (HUF)</p>
                    <p><i class="fas fa-language"></i> שפה: הונגרית, אך רבים מדברים אנגלית בתיירות</p>
                    <p><i class="fas fa-subway"></i> תחבורה: מטרו, חשמלית ואוטובוסים זמינים</p>
                    <p><i class="fas fa-phone"></i> חיוג: קידומת +36</p>
                `,
                icon: 'info-circle'
            },
            {
                id: '2',
                title: 'מקומות מומלצים',
                content: `
                    <p><i class="fas fa-landmark"></i> גבעת המצודה ובית המחוקקים</p>
                    <p><i class="fas fa-hot-tub"></i> מרחצאות תרמיים (Széchenyi, Gellért)</p>
                    <p><i class="fas fa-store"></i> שוק מרכזי (Great Market Hall)</p>
                    <p><i class="fas fa-building"></i> רובע היהודי ובתי הקפה</p>
                    <p><i class="fas fa-water"></i> שייט על הדנובה</p>
                `,
                icon: 'landmark'
            },
            {
                id: '3',
                title: 'מספרי חירום',
                content: `
                    <p><i class="fas fa-ambulance"></i> חירום כללי: 112</p>
                    <p><i class="fas fa-passport"></i> שגרירות ישראל: +36-1-392-6200</p>
                `,
                icon: 'ambulance'
            }
        ];
        
        sampleInfo.forEach(info => infoManager.addItem(info));
    }

    // רנדור התצוגה הראשונית של מידע
    renderInfo();

    // הוספת כפתור בדיקה למודל
    const testModalBtn = document.getElementById('testModalBtn');
    if (testModalBtn) {
        testModalBtn.addEventListener('click', () => {
            console.log('Opening test modal');
            openModal('edit-info-modal');
        });
    }

    function editTitle() {
        const titleElement = document.getElementById('appTitle');
        const currentTitle = titleElement.textContent;
        
        // הפיכת הכותרת לניתנת לעריכה
        titleElement.contentEditable = true;
        titleElement.classList.add('editing');
        titleElement.focus();
        
        // שמירת הכותרת בלחיצה על Enter
        const handleEnter = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                titleElement.blur();
            }
        };
        
        // שמירת הכותרת כשיוצאים מהפוקוס
        const handleBlur = () => {
            titleElement.contentEditable = false;
            titleElement.classList.remove('editing');
            
            const newTitle = titleElement.textContent.trim();
            if (newTitle && newTitle !== currentTitle) {
                localStorage.setItem('appTitle', newTitle);
                document.title = newTitle;
            } else if (!newTitle) {
                titleElement.textContent = currentTitle;
            }
            
            titleElement.removeEventListener('keydown', handleEnter);
            titleElement.removeEventListener('blur', handleBlur);
        };
        
        titleElement.addEventListener('keydown', handleEnter);
        titleElement.addEventListener('blur', handleBlur);
    }

    // טעינת הכותרת בטעינת הדף
    const savedTitle = localStorage.getItem('appTitle');
    if (savedTitle) {
        const titleElement = document.getElementById('appTitle');
        titleElement.textContent = savedTitle;
        document.title = savedTitle;
    }

    // הוספת מאזין אירועים לכפתור העריכה
    const editButton = document.querySelector('.edit-title-btn');
    if (editButton) {
        editButton.addEventListener('click', editTitle);
    }

    addDayBtn.addEventListener('click', () => {
        const dayCount = dayButtons.length;
        const newDayNum = dayCount + 1;
        
        const newDayBtn = document.createElement('button');
        newDayBtn.className = 'day-btn';
        newDayBtn.dataset.day = newDayNum.toString();
        newDayBtn.textContent = `יום ${newDayNum}`;
        
        newDayBtn.addEventListener('click', () => {
            dayButtons.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
            newDayBtn.classList.add('active');
            activeDay = newDayNum.toString();
            renderSchedule();
        });
        
        addDayBtn.parentNode.insertBefore(newDayBtn, addDayBtn);
    });

    // ===== פונקציות הגדרות =====

    // יבוא ויצוא נתונים
    function setupSettingsHandlers() {
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsModal = document.getElementById('settings-modal');
        const closeBtn = settingsModal.querySelector('.close-btn');
        const exportDataBtn = document.getElementById('exportDataBtn');
        const importDataBtn = document.getElementById('importDataBtn');
        const importFileInput = document.getElementById('importFileInput');
        const resetAppBtn = document.getElementById('resetAppBtn');
        
        // פתיחת מודל ההגדרות
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                settingsModal.classList.add('show');
            });
        }
        
        // סגירת מודל ההגדרות
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                settingsModal.classList.remove('show');
            });
        }
        
        // סגירת המודל בלחיצה מחוץ לתוכן
        window.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.classList.remove('show');
            }
        });
        
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', exportData);
        }
        
        if (importDataBtn) {
            importDataBtn.addEventListener('click', () => {
                importFileInput.click();
            });
        }
        
        if (importFileInput) {
            importFileInput.addEventListener('change', importData);
        }
        
        if (resetAppBtn) {
            resetAppBtn.addEventListener('click', resetApp);
        }
    }

    // ייצוא כל הנתונים לקובץ JSON
    function exportData() {
        // איסוף כל הנתונים מה-localStorage
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try {
                data[key] = JSON.parse(localStorage.getItem(key));
            } catch (e) {
                data[key] = localStorage.getItem(key);
            }
        }
        
        // יצירת קובץ JSON להורדה
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        // יצירת קישור להורדה והפעלתו
        const a = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        a.download = `mytrip-backup-${timestamp}.json`;
        a.href = url;
        a.click();
        
        // שחרור משאבים
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 100);
        
        showToast('הנתונים יוצאו בהצלחה!');
    }

    // ייבוא נתונים מקובץ JSON
    function importData(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                // אישור מהמשתמש
                if (confirm('פעולה זו תחליף את כל הנתונים הקיימים. האם להמשיך?')) {
                    // שמירת הנתונים ב-localStorage
                    for (const key in data) {
                        if (typeof data[key] === 'object') {
                            localStorage.setItem(key, JSON.stringify(data[key]));
                        } else {
                            localStorage.setItem(key, data[key]);
                        }
                    }
                    
                    showToast('הנתונים יובאו בהצלחה! מרענן את העמוד...');
                    
                    // רענון העמוד כדי לטעון את הנתונים החדשים
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                }
            } catch (error) {
                console.error('שגיאה בייבוא נתונים:', error);
                showToast('שגיאה בייבוא הנתונים. אנא ודא שהקובץ תקין.', 'error');
            }
        };
        
        reader.readAsText(file);
        
        // איפוס שדה הקובץ כדי לאפשר בחירה חוזרת של אותו קובץ
        event.target.value = '';
    }

    // איפוס כל הנתונים באפליקציה
    function resetApp() {
        if (confirm('האם אתה בטוח שברצונך למחוק את כל הנתונים? פעולה זו אינה ניתנת לביטול!')) {
            if (confirm('אזהרה אחרונה: כל הנתונים יימחקו לצמיתות. האם להמשיך?')) {
                // גיבוי אוטומטי לפני מחיקה
                exportData();
                
                // מחיקת כל הנתונים מ-localStorage
                localStorage.clear();
                
                showToast('כל הנתונים נמחקו. מרענן את העמוד...');
                
                // רענון העמוד
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        }
    }

    // הצגת הודעה למשתמש
    function showToast(message, type = 'success') {
        // בדיקה אם יש כבר אלמנט toast
        let toast = document.querySelector('.toast');
        
        // אם אין, יוצרים אחד חדש
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        
        // הגדרת סוג ההודעה
        toast.className = `toast ${type}`;
        
        // הגדרת תוכן ההודעה
        toast.textContent = message;
        
        // הצגת ההודעה
        toast.classList.add('show');
        
        // הסרת ההודעה אחרי 3 שניות
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // אתחול הגדרות
    setupSettingsHandlers();
}); 