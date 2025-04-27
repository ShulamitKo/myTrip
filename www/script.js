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
            super('schedule');
        }
        
        getFilteredItems(property, value) {
            // מחזיר רשימה מסוננת לפי המאפיין והערך שהתקבלו
            return this.items.filter(item => item[property] === value);
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
                    showDeleteConfirmation('האם אתה בטוח שברצונך למחוק את המשימה?', () => {
                        taskManager.deleteItem(task.id);
                        renderTasks();
                    });
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
                    showDeleteConfirmation('האם אתה בטוח שברצונך למחוק את הפריט?', () => {
                        shoppingManager.deleteItem(item.id);
                        renderShoppingList();
                    });
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
                    showDeleteConfirmation('האם אתה בטוח שברצונך למחוק את המקום?', () => {
                        placeManager.deleteItem(place.id);
                        renderPlaces();
                    });
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
            // קבלת היום הפעיל הנוכחי מהאלמנט הפעיל בממשק
            const activeButton = document.querySelector('.day-btn.active');
            const currentActiveDay = activeButton ? activeButton.dataset.day : activeDay;
            
            console.log('Adding schedule item for day:', currentActiveDay, 'Text:', scheduleText, 'Time:', timeValue);
            
            const newItem = {
                id: Date.now().toString(),
                text: scheduleText,
                time: timeValue,
                day: currentActiveDay,
                completed: false,
                category: 'general'
            };
            
            scheduleManager.addItem(newItem);
            console.log('Added new schedule item:', newItem);
            
            renderSchedule();
            
            scheduleInput.value = '';
            
            // חישוב השעה הבאה, שעה אחת אחרי הפעילות שנוספה
            const [hours, minutes] = timeValue.split(':');
            const date = new Date();
            date.setHours(parseInt(hours));
            date.setMinutes(parseInt(minutes));
            date.setHours(date.getHours() + 1);
            
            // עדכון השעה לשעה הבאה
            const nextHour = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
            scheduleTime.value = nextHour;
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
                // קבלת היום הפעיל הנוכחי מהאלמנט הפעיל בממשק
                const activeButton = document.querySelector('.day-btn.active');
                const currentActiveDay = activeButton ? activeButton.dataset.day : activeDay;
                
                // עדכון הפריט הקיים
                scheduleManager.updateItem(activity.id, {
                    time: scheduleTime.value,
                    text: scheduleInput.value.trim(),
                    day: currentActiveDay
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
        console.log('Rendering schedule for day:', activeDay, 'Activities:', activities); 
        console.log('All schedule items in localStorage:', scheduleManager.getAllItems());
        activities.sort((a, b) => a.time.localeCompare(b.time));
        
        // עדכון שעת ברירת המחדל לשעה אחרי הפעילות האחרונה
        updateDefaultScheduleTime(activities);
        
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
                    showDeleteConfirmation('האם אתה בטוח שברצונך למחוק את הפעילות?', () => {
                        scheduleManager.deleteItem(activity.id);
                        renderSchedule();
                    });
                });
                
                scheduleList.appendChild(timeBlock);
            });
        }
    }
    
    // פונקציה לעדכון שעת ברירת המחדל בלו"ז
    function updateDefaultScheduleTime(activities) {
        if (activities.length > 0) {
            // מיון הפעילויות לפי זמן
            const sortedActivities = [...activities].sort((a, b) => a.time.localeCompare(b.time));
            // קבלת הפעילות האחרונה
            const lastActivity = sortedActivities[sortedActivities.length - 1];
            
            // חישוב שעה אחת אחרי הפעילות האחרונה
            const [hours, minutes] = lastActivity.time.split(':');
            const date = new Date();
            date.setHours(parseInt(hours));
            date.setMinutes(parseInt(minutes));
            
            // הוספת שעה אחת
            date.setHours(date.getHours() + 1);
            
            // פורמט השעה לתצוגה
            const nextHour = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
            
            // עדכון שדה השעה
            scheduleTime.value = nextHour;
        } else {
            // אם אין פעילויות, השעה תהיה 09:00 כברירת מחדל
            scheduleTime.value = "09:00";
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
    
    // מאזין אירועים לכפתורי היום
    dayButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('Day button clicked:', btn.dataset.day); // שורת לוג לדיבאג
            document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeDay = btn.dataset.day;
            console.log('Active day changed to:', activeDay); // שורת לוג לדיבאג
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
    
    // הוספת מאזין אירועים ללחיצה על Enter בתיבת הטקסט של לו"ז
    scheduleInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !addScheduleBtn.classList.contains('editing')) {
            e.preventDefault();
            addScheduleItem();
        }
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
                    showDeleteConfirmation('האם אתה בטוח שברצונך למחוק את המסעדה?', () => {
                        foodManager.deleteItem(food.id);
                        renderFood();
                    });
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
    renderFood();
    renderInfo();
    
    // הגדרת הכפתור הפעיל בלשונית לו"ז
    document.querySelectorAll('.day-btn').forEach(btn => {
        if (btn.dataset.day === activeDay) {
            document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        }
    });
    
    // רנדור של הלו"ז חייב להיות אחרי הגדרת הכפתור הפעיל
    renderSchedule();

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
            // פתיחת מודאל להוספת כותרת בלבד
            const modal = document.createElement('div');
            modal.className = 'modal inline-edit-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-btn">&times;</span>
                    <h3>הוספת כותרת מידע חדשה</h3>
                    <form id="add-info-title-form">
                        <div class="form-group">
                            <label for="new-info-title">כותרת</label>
                            <input type="text" id="new-info-title" value="${title}" required>
                        </div>
                        <div class="form-group">
                            <label for="new-info-icon">אייקון</label>
                            <select id="new-info-icon">
                                <option value="info-circle">מידע כללי</option>
                                <option value="money-bill-wave">כספים</option>
                                <option value="language">שפה</option>
                                <option value="subway">תחבורה</option>
                                <option value="phone">תקשורת</option>
                                <option value="landmark">אתרים</option>
                                <option value="utensils">אוכל</option>
                                <option value="store">קניות</option>
                                <option value="ambulance">חירום</option>
                                <option value="hot-tub">ספא</option>
                                <option value="building">מבנים</option>
                                <option value="water">מים</option>
                                <option value="passport">דרכון</option>
                                <option value="mountain">הרים/טבע</option>
                                <option value="map-marked-alt">מפה/מיקום</option>
                            </select>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn primary-btn">שמור</button>
                            <button type="button" class="btn close-modal">ביטול</button>
                        </div>
                    </form>
                </div>
            `;
            
            document.body.appendChild(modal);
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            
            // מאזין לכפתור הסגירה
            const closeBtn = modal.querySelector('.close-btn');
            closeBtn.addEventListener('click', () => {
                closeInlineModal(modal);
            });
            
            // מאזין לכפתור הביטול
            const cancelBtn = modal.querySelector('.close-modal');
            cancelBtn.addEventListener('click', () => {
                closeInlineModal(modal);
            });
            
            // מאזין לטופס שמירה
            const form = modal.querySelector('form');
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const newTitle = modal.querySelector('#new-info-title').value.trim();
                const newIcon = modal.querySelector('#new-info-icon').value;
                
                if (!newTitle) {
                    alert('נא להזין כותרת');
                    return;
                }
                
                // הוספת כרטיס מידע חדש עם כותרת בלבד
                infoManager.addItem({
                    id: Date.now().toString(),
                    title: newTitle,
                    icon: newIcon,
                    items: []
                });
                
                renderInfo();
                closeInlineModal(modal);
            });
            
            infoInput.value = '';
        }
    }

    function editInfo(info) {
        document.getElementById('edit-info-id').value = info.id;
        document.getElementById('edit-info-title').value = info.title;
        document.getElementById('edit-info-icon').value = info.icon || 'info-circle';
        
        // איפוס מיכל הפריטים
        const container = document.getElementById('info-items-container');
        container.innerHTML = '';
        
        // אם זה המבנה החדש עם פריטים
        if (info.items && Array.isArray(info.items)) {
            info.items.forEach(item => {
                addInfoItemRow(item.text, item.icon);
            });
        }
        
        openModal('edit-info-modal');
    }
    
    // פונקציה להוספת שורת פריט חדשה
    function addInfoItemRow(text = '', icon = 'info-circle') {
        const container = document.getElementById('info-items-container');
        const rowIndex = container.children.length;
        
        const row = document.createElement('div');
        row.className = 'info-item-row';
        row.innerHTML = `
            <div class="info-item-inputs">
                <select class="info-item-icon" name="info-item-icon-${rowIndex}">
                    <option value="info-circle" ${icon === 'info-circle' ? 'selected' : ''}>מידע כללי</option>
                    <option value="money-bill-wave" ${icon === 'money-bill-wave' ? 'selected' : ''}>כספים</option>
                    <option value="language" ${icon === 'language' ? 'selected' : ''}>שפה</option>
                    <option value="subway" ${icon === 'subway' ? 'selected' : ''}>תחבורה</option>
                    <option value="phone" ${icon === 'phone' ? 'selected' : ''}>תקשורת</option>
                    <option value="landmark" ${icon === 'landmark' ? 'selected' : ''}>אתרים</option>
                    <option value="utensils" ${icon === 'utensils' ? 'selected' : ''}>אוכל</option>
                    <option value="store" ${icon === 'store' ? 'selected' : ''}>קניות</option>
                    <option value="ambulance" ${icon === 'ambulance' ? 'selected' : ''}>חירום</option>
                    <option value="hot-tub" ${icon === 'hot-tub' ? 'selected' : ''}>ספא</option>
                    <option value="building" ${icon === 'building' ? 'selected' : ''}>מבנים</option>
                    <option value="water" ${icon === 'water' ? 'selected' : ''}>מים</option>
                    <option value="passport" ${icon === 'passport' ? 'selected' : ''}>דרכון</option>
                    <option value="mountain" ${icon === 'mountain' ? 'selected' : ''}>הרים/טבע</option>
                    <option value="map-marked-alt" ${icon === 'map-marked-alt' ? 'selected' : ''}>מפה/מיקום</option>
                </select>
                <input type="text" class="info-item-text" name="info-item-text-${rowIndex}" value="${text}" placeholder="הכנס טקסט מידע...">
                <button type="button" class="remove-info-item-btn" title="הסר פריט זה">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // הוספת מאזין אירועים לכפתור ההסרה
        const removeBtn = row.querySelector('.remove-info-item-btn');
        removeBtn.addEventListener('click', function() {
            row.remove();
        });
        
        container.appendChild(row);
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
                infoCard.dataset.infoId = info.id;
                
                // יצירת כותרת עם כפתור עריכה צמוד
                let headerHTML = `
                    <div class="info-header">
                        <div class="info-main-info">
                            <div class="info-title">
                                <i class="fas fa-${info.icon}"></i>
                                <span class="title-text">${info.title}</span>
                                <button class="edit-item-btn edit-title-inline" title="ערוך כותרת">
                                    <i class="fas fa-pencil-alt"></i>
                                </button>
                            </div>
                        </div>
                        <div class="info-actions">
                            <button class="info-action add-info-row-action" title="הוסף שורת מידע">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button class="info-action delete-action" title="מחק כרטיס מידע">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                
                // יצירת תוכן עם כפתורי עריכה לכל שורה
                let contentHTML = '<div class="info-content">';
                
                // וידוא שמערך הפריטים קיים (אבל יכול להיות ריק)
                if (!info.items) {
                    info.items = [];
                    infoManager.updateItem(info.id, info);
                }
                
                if (info.items.length === 0) {
                    contentHTML += `
                        <div class="empty-info-items">
                            <p>אין פריטי מידע. לחץ על + להוספת פריט.</p>
                        </div>
                    `;
                } else {
                    info.items.forEach((item, index) => {
                        contentHTML += `
                            <div class="info-row" data-index="${index}">
                                <div class="info-row-content">
                                    <i class="fas fa-${item.icon}"></i>
                                    <span class="info-row-text">${item.text}</span>
                                </div>
                                <div class="info-row-actions">
                                    <button class="edit-row-btn" title="ערוך שורה">
                                        <i class="fas fa-pencil-alt"></i>
                                    </button>
                                    <button class="delete-row-btn" title="מחק שורה">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        `;
                    });
                }
                
                contentHTML += '</div>';
                
                infoCard.innerHTML = headerHTML + contentHTML;
                
                // הוספת מאזיני אירועים לכפתורי העריכה והמחיקה
                
                // עריכת כותרת
                const editTitleBtn = infoCard.querySelector('.edit-title-inline');
                editTitleBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const titleSpan = infoCard.querySelector('.title-text');
                    const currentTitle = titleSpan.textContent;
                    const iconElement = infoCard.querySelector('.info-title i');
                    const currentIcon = iconElement.className.replace('fas fa-', '');
                    
                    // פתיחת מודאל עריכת כותרת
                    openTitleEditModal(info.id, currentTitle, currentIcon);
                });
                
                // הוספת שורת מידע
                const addRowBtn = infoCard.querySelector('.add-info-row-action');
                addRowBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openAddRowModal(info.id);
                });
                
                // מחיקת כרטיס המידע
                const deleteAction = infoCard.querySelector('.delete-action');
                deleteAction.addEventListener('click', () => {
                    showDeleteConfirmation('האם אתה בטוח שברצונך למחוק את כרטיס המידע?', () => {
                        infoManager.deleteItem(info.id);
                        renderInfo();
                    });
                });
                
                // עריכת שורות מידע
                infoCard.querySelectorAll('.edit-row-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const row = btn.closest('.info-row');
                        const index = parseInt(row.dataset.index);
                        const rowContent = info.items[index];
                        
                        // פתיחת מודאל עריכת שורה
                        openRowEditModal(info.id, index, rowContent.text, rowContent.icon);
                    });
                });
                
                // מחיקת שורות מידע
                infoCard.querySelectorAll('.delete-row-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const row = btn.closest('.info-row');
                        const index = parseInt(row.dataset.index);
                        
                        showDeleteConfirmation('האם אתה בטוח שברצונך למחוק את שורת המידע?', () => {
                            // יצירת עותק של הפריט
                            const updatedInfo = JSON.parse(JSON.stringify(info));
                            // מחיקת השורה לפי האינדקס
                            updatedInfo.items.splice(index, 1);
                            
                            // עדכון המידע
                            infoManager.updateItem(info.id, updatedInfo);
                            renderInfo();
                        });
                    });
                });
                
                infoList.appendChild(infoCard);
            });
        }
    }
    
    // פונקציה לפתיחת מודאל עריכת כותרת
    function openTitleEditModal(infoId, currentTitle, currentIcon) {
        const modal = document.createElement('div');
        modal.className = 'modal inline-edit-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn">&times;</span>
                <h3>עריכת כותרת</h3>
                <form id="edit-title-form">
                    <input type="hidden" id="info-id" value="${infoId}">
                    <div class="form-group">
                        <label for="edit-title-text">כותרת</label>
                        <input type="text" id="edit-title-text" value="${currentTitle}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-title-icon">אייקון</label>
                        <select id="edit-title-icon">
                            <option value="info-circle" ${currentIcon === 'info-circle' ? 'selected' : ''}>מידע כללי</option>
                            <option value="money-bill-wave" ${currentIcon === 'money-bill-wave' ? 'selected' : ''}>כספים</option>
                            <option value="language" ${currentIcon === 'language' ? 'selected' : ''}>שפה</option>
                            <option value="subway" ${currentIcon === 'subway' ? 'selected' : ''}>תחבורה</option>
                            <option value="phone" ${currentIcon === 'phone' ? 'selected' : ''}>תקשורת</option>
                            <option value="landmark" ${currentIcon === 'landmark' ? 'selected' : ''}>אתרים</option>
                            <option value="utensils" ${currentIcon === 'utensils' ? 'selected' : ''}>אוכל</option>
                            <option value="store" ${currentIcon === 'store' ? 'selected' : ''}>קניות</option>
                            <option value="ambulance" ${currentIcon === 'ambulance' ? 'selected' : ''}>חירום</option>
                            <option value="hot-tub" ${currentIcon === 'hot-tub' ? 'selected' : ''}>ספא</option>
                            <option value="building" ${currentIcon === 'building' ? 'selected' : ''}>מבנים</option>
                            <option value="water" ${currentIcon === 'water' ? 'selected' : ''}>מים</option>
                            <option value="passport" ${currentIcon === 'passport' ? 'selected' : ''}>דרכון</option>
                            <option value="mountain" ${currentIcon === 'mountain' ? 'selected' : ''}>הרים/טבע</option>
                            <option value="map-marked-alt" ${currentIcon === 'map-marked-alt' ? 'selected' : ''}>מפה/מיקום</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn primary-btn">שמור</button>
                        <button type="button" class="btn close-modal">ביטול</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // מאזין לכפתור הסגירה
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            closeInlineModal(modal);
        });
        
        // מאזין לכפתור הביטול
        const cancelBtn = modal.querySelector('.close-modal');
        cancelBtn.addEventListener('click', () => {
            closeInlineModal(modal);
        });
        
        // מאזין לטופס שמירה
        const form = modal.querySelector('form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const newTitle = modal.querySelector('#edit-title-text').value.trim();
            const newIcon = modal.querySelector('#edit-title-icon').value;
            
            if (!newTitle) {
                alert('נא להזין כותרת');
                return;
            }
            
            // קבלת הפריט הנוכחי
            const info = infoManager.getAllItems().find(item => item.id === infoId);
            if (info) {
                // עדכון רק של הכותרת והאייקון, בלי לגעת בפריטי המידע
                infoManager.updateItem(infoId, {
                    ...info,
                    title: newTitle,
                    icon: newIcon
                });
                renderInfo();
            }
            
            closeInlineModal(modal);
        });
    }
    
    // פונקציה לפתיחת מודאל הוספת שורת מידע
    function openAddRowModal(infoId) {
        const modal = document.createElement('div');
        modal.className = 'modal inline-edit-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn">&times;</span>
                <h3>הוספת שורת מידע</h3>
                <form id="add-row-form">
                    <input type="hidden" id="info-id" value="${infoId}">
                    <div class="form-group">
                        <label for="add-row-text">טקסט</label>
                        <input type="text" id="add-row-text" required>
                    </div>
                    <div class="form-group">
                        <label for="add-row-icon">אייקון</label>
                        <select id="add-row-icon">
                            <option value="info-circle">מידע כללי</option>
                            <option value="money-bill-wave">כספים</option>
                            <option value="language">שפה</option>
                            <option value="subway">תחבורה</option>
                            <option value="phone">תקשורת</option>
                            <option value="landmark">אתרים</option>
                            <option value="utensils">אוכל</option>
                            <option value="store">קניות</option>
                            <option value="ambulance">חירום</option>
                            <option value="hot-tub">ספא</option>
                            <option value="building">מבנים</option>
                            <option value="water">מים</option>
                            <option value="passport">דרכון</option>
                            <option value="mountain">הרים/טבע</option>
                            <option value="map-marked-alt">מפה/מיקום</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn primary-btn">הוסף</button>
                        <button type="button" class="btn close-modal">ביטול</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // מאזין לכפתור הסגירה
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            closeInlineModal(modal);
        });
        
        // מאזין לכפתור הביטול
        const cancelBtn = modal.querySelector('.close-modal');
        cancelBtn.addEventListener('click', () => {
            closeInlineModal(modal);
        });
        
        // מאזין לטופס שמירה
        const form = modal.querySelector('form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const rowText = modal.querySelector('#add-row-text').value.trim();
            const rowIcon = modal.querySelector('#add-row-icon').value;
            
            if (!rowText) {
                alert('נא להזין טקסט');
                return;
            }
            
            // קבלת הפריט הנוכחי
            const info = infoManager.getAllItems().find(item => item.id === infoId);
            if (info) {
                // יצירת עותק של הפריט
                const updatedInfo = JSON.parse(JSON.stringify(info));
                // וידוא שקיים מערך פריטים
                if (!updatedInfo.items) {
                    updatedInfo.items = [];
                }
                // הוספת השורה החדשה
                updatedInfo.items.push({
                    text: rowText,
                    icon: rowIcon
                });
                // עדכון המידע
                infoManager.updateItem(infoId, updatedInfo);
                renderInfo();
            }
            
            closeInlineModal(modal);
        });
    }
    
    // פונקציה לפתיחת מודאל עריכת שורת מידע
    function openRowEditModal(infoId, rowIndex, currentText, currentIcon) {
        const modal = document.createElement('div');
        modal.className = 'modal inline-edit-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn">&times;</span>
                <h3>עריכת שורת מידע</h3>
                <form id="edit-row-form">
                    <input type="hidden" id="info-id" value="${infoId}">
                    <input type="hidden" id="row-index" value="${rowIndex}">
                    <div class="form-group">
                        <label for="edit-row-text">טקסט</label>
                        <input type="text" id="edit-row-text" value="${currentText}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-row-icon">אייקון</label>
                        <select id="edit-row-icon">
                            <option value="info-circle" ${currentIcon === 'info-circle' ? 'selected' : ''}>מידע כללי</option>
                            <option value="money-bill-wave" ${currentIcon === 'money-bill-wave' ? 'selected' : ''}>כספים</option>
                            <option value="language" ${currentIcon === 'language' ? 'selected' : ''}>שפה</option>
                            <option value="subway" ${currentIcon === 'subway' ? 'selected' : ''}>תחבורה</option>
                            <option value="phone" ${currentIcon === 'phone' ? 'selected' : ''}>תקשורת</option>
                            <option value="landmark" ${currentIcon === 'landmark' ? 'selected' : ''}>אתרים</option>
                            <option value="utensils" ${currentIcon === 'utensils' ? 'selected' : ''}>אוכל</option>
                            <option value="store" ${currentIcon === 'store' ? 'selected' : ''}>קניות</option>
                            <option value="ambulance" ${currentIcon === 'ambulance' ? 'selected' : ''}>חירום</option>
                            <option value="hot-tub" ${currentIcon === 'hot-tub' ? 'selected' : ''}>ספא</option>
                            <option value="building" ${currentIcon === 'building' ? 'selected' : ''}>מבנים</option>
                            <option value="water" ${currentIcon === 'water' ? 'selected' : ''}>מים</option>
                            <option value="passport" ${currentIcon === 'passport' ? 'selected' : ''}>דרכון</option>
                            <option value="mountain" ${currentIcon === 'mountain' ? 'selected' : ''}>הרים/טבע</option>
                            <option value="map-marked-alt" ${currentIcon === 'map-marked-alt' ? 'selected' : ''}>מפה/מיקום</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn primary-btn">שמור</button>
                        <button type="button" class="btn close-modal">ביטול</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // מאזין לכפתור הסגירה
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            closeInlineModal(modal);
        });
        
        // מאזין לכפתור הביטול
        const cancelBtn = modal.querySelector('.close-modal');
        cancelBtn.addEventListener('click', () => {
            closeInlineModal(modal);
        });
        
        // מאזין לטופס שמירה
        const form = modal.querySelector('form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const newText = modal.querySelector('#edit-row-text').value.trim();
            const newIcon = modal.querySelector('#edit-row-icon').value;
            
            if (!newText) {
                alert('נא להזין טקסט');
                return;
            }
            
            // קבלת הפריט הנוכחי
            const info = infoManager.getAllItems().find(item => item.id === infoId);
            if (info && info.items && info.items[rowIndex]) {
                // יצירת עותק של הפריט
                const updatedInfo = JSON.parse(JSON.stringify(info));
                // עדכון השורה
                updatedInfo.items[rowIndex] = {
                    text: newText,
                    icon: newIcon
                };
                // עדכון המידע
                infoManager.updateItem(infoId, updatedInfo);
                renderInfo();
            }
            
            closeInlineModal(modal);
        });
    }
    
    // פונקציה לסגירת מודאל
    function closeInlineModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }

    // אירועי לחיצה למידע
    addInfoBtn.addEventListener('click', addInfo);
    infoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addInfo();
    });
    
    // מאזין אירועים לכפתור הוספת פריט מידע
    document.getElementById('add-info-item-btn').addEventListener('click', () => {
        addInfoItemRow();
    });

    // טיפול בטופס המידע
    document.getElementById('edit-info-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const infoId = document.getElementById('edit-info-id').value;
        
        // איסוף כל פריטי המידע
        const itemRows = document.querySelectorAll('.info-item-row');
        const infoItems = Array.from(itemRows).map(row => {
            return {
                icon: row.querySelector('.info-item-icon').value,
                text: row.querySelector('.info-item-text').value.trim()
            };
        });
        
        const updatedInfo = {
            title: document.getElementById('edit-info-title').value.trim(),
            icon: document.getElementById('edit-info-icon').value,
            items: infoItems
        };
        
        // וידוא שיש כותרת
        if (!updatedInfo.title) {
            updatedInfo.title = "מידע חדש";
        }
        
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
                title: 'טיפים שימושיים לטיול',
                icon: 'info-circle',
                items: [
                    { icon: 'money-bill-wave', text: 'זכור לבדוק את המטבע המקומי' },
                    { icon: 'language', text: 'בדוק אילו שפות מדוברות ביעד' },
                    { icon: 'subway', text: 'בדוק אפשרויות תחבורה ציבורית' },
                    { icon: 'phone', text: 'שמור מספרי טלפון חשובים' }
                ]
            },
            {
                id: '2',
                title: 'הצעות למקומות לבקר',
                icon: 'landmark',
                items: [
                    { icon: 'landmark', text: 'אתרים היסטוריים' },
                    { icon: 'store', text: 'שווקים מקומיים' },
                    { icon: 'utensils', text: 'מסעדות מומלצות' },
                    { icon: 'mountain', text: 'מסלולי טבע' },
                    { icon: 'map-marked-alt', text: 'אטרקציות מרכזיות' }
                ]
            },
            {
                id: '3',
                title: 'מספרי חירום',
                icon: 'ambulance',
                items: [
                    { icon: 'ambulance', text: 'חירום כללי: 112' },
                    { icon: 'passport', text: 'שגרירות ישראל: יש לבדוק באתר משרד החוץ' }
                ]
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
        // מקבלים את הרשימה המעודכנת של כפתורי יום
        const currentDayButtons = document.querySelectorAll('.day-btn');
        const dayCount = currentDayButtons.length;
        const newDayNum = dayCount + 1;
        
        const newDayBtn = document.createElement('button');
        newDayBtn.className = 'day-btn';
        newDayBtn.dataset.day = newDayNum.toString();
        newDayBtn.textContent = `יום ${newDayNum}`;
        newDayBtn.title = `הצג לו"ז ליום ${newDayNum}`;
        
        // מוסיפים את הכפתור החדש לפני כפתור ה-+
        addDayBtn.parentNode.insertBefore(newDayBtn, addDayBtn);
        
        // מעדכנים את מאזיני האירועים לכל הכפתורים
        setupDayButtonEvents();
        
        // מעדכנים את היום הפעיל לחדש
        document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
        newDayBtn.classList.add('active');
        activeDay = newDayNum.toString();
        console.log('Added new day button, active day is now:', activeDay);
        renderSchedule();
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
        const privacyPolicyLink = document.getElementById('privacy-policy-link');
        
        // טיפול בקישור מדיניות פרטיות
        if (privacyPolicyLink) {
            privacyPolicyLink.addEventListener('click', function(e) {
                e.preventDefault();
                window.open('privacy_policy.html', '_blank');
            });
        }
        
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
        
        // יצירת מחרוזת JSON
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        // בדיקה אם האפליקציה רצה על מובייל (Capacitor או Cordova)
        const isMobile = typeof window.Capacitor !== 'undefined' || typeof cordova !== 'undefined';
        
        if (isMobile) {
            // בדיקת הרשאות - רק באנדרואיד
            requestStoragePermission().then(() => {
                // יצירת קובץ JSON בזיכרון המכשיר
                showToast('מייצא נתונים...', 'info');
                
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const fileName = `mytrip-backup-${timestamp}.json`;
                
                console.log("מתחיל תהליך ייצוא למובייל");
                
                // בדיקה אם קיים plugin של cordova לקבצים
                if (typeof cordova !== 'undefined' && cordova.file) {
                    console.log("משתמש ב-Cordova File Plugin");
                    
                    // שימוש בשיטה פשוטה יותר - ניסיון ישיר לתיקיית ההורדות
                    try {
                        // בחירה בין אפשרויות לתיקיית ההורדות, לפי סדר עדיפות
                        const targetDir = getDownloadsPath();
                        console.log(`מנסה להשתמש בתיקייה: ${targetDir}`);
                        
                        if (!targetDir) {
                            throw new Error("לא נמצאה תיקיית הורדות זמינה");
                        }
                        
                        // שימוש בממשק File API של Cordova
                        window.resolveLocalFileSystemURL(targetDir, function(dirEntry) {
                            console.log(`הצלחה בגישה לתיקייה: ${dirEntry.fullPath}`);
                            
                            // יצירת הקובץ
                            dirEntry.getFile(fileName, { create: true, exclusive: false }, function(fileEntry) {
                                console.log(`הצלחה ביצירת קובץ: ${fileEntry.fullPath}`);
                                
                                // כתיבה לקובץ
                                fileEntry.createWriter(function(writer) {
                                    writer.onwriteend = function() {
                                        console.log(`הקובץ נשמר ב: ${fileEntry.nativeURL || fileEntry.fullPath}`);
                                        
                                        // הצגת הודעה פשוטה בלבד ללא נתיב
                                        showToast(`הנתונים יוצאו בהצלחה לתיקיית ההורדות`, 'success', 3000);
                                        
                                        // לא מציגים את הנתיב ולא משתפים
                                    };
                                    
                                    writer.onerror = function(err) {
                                        console.error("שגיאה בכתיבה לקובץ:", err);
                                        showToast("שגיאה בשמירת הקובץ", 'error');
                                    };
                                    
                                    // כתיבת התוכן לקובץ
                                    writer.write(dataBlob);
                                }, function(err) {
                                    console.error("שגיאה ביצירת כותב קבצים:", err);
                                    showToast("שגיאה ביצירת הקובץ", 'error');
                                });
                            }, function(err) {
                                console.error("שגיאה ביצירת קובץ:", err);
                                showToast("שגיאה ביצירת הקובץ", 'error');
                            });
                        }, function(err) {
                            console.error("שגיאה בגישה לתיקיית ההורדות:", err);
                            showToast("שגיאה בגישה לתיקיית ההורדות", 'error');
                            
                            // ננסה במיקום אחר
                            fallbackToInternalStorage(fileName, dataBlob);
                        });
                    } catch (err) {
                        console.error("שגיאה כללית בייצוא הקובץ:", err);
                        showToast("שגיאה בייצוא הקובץ", 'error');
                        
                        // נסיון נוסף במיקום אחר
                        fallbackToInternalStorage(fileName, dataBlob);
                    }
                } else {
                    // במקרה שאין את הפלאגין, נשתמש ב-File System Access API אם קיים
                    console.log("אין Cordova File Plugin, מנסה דרכים חלופיות");
                    
                    if ('showSaveFilePicker' in window) {
                        const opts = {
                            suggestedName: fileName,
                            types: [{
                                description: 'JSON File',
                                accept: { 'application/json': ['.json'] }
                            }]
                        };
                        
                        window.showSaveFilePicker(opts)
                            .then(fileHandle => fileHandle.createWritable())
                            .then(writable => {
                                writable.write(dataBlob);
                                return writable.close();
                            })
                            .then(() => showToast('הנתונים יוצאו בהצלחה!'))
                            .catch(err => {
                                console.error('שגיאה בשמירת הקובץ:', err);
                                showToast('אירעה שגיאה בייצוא הנתונים.', 'error');
                            });
                    } else {
                        // אם אין שום אפשרות אחרת, ננסה את שיטת הדפדפן הרגילה
                        const url = URL.createObjectURL(dataBlob);
                        const a = document.createElement('a');
                        a.download = fileName;
                        a.href = url;
                        a.click();
                        
                        setTimeout(() => {
                            URL.revokeObjectURL(url);
                        }, 100);
                        
                        showToast('הנתונים יוצאו בהצלחה! אם לא ראית חלון הורדה, ייתכן שהורדת קבצים אינה נתמכת במכשירך.');
                    }
                }
            }).catch(error => {
                console.error('שגיאה בקבלת הרשאות:', error);
                showToast('אין הרשאות מספיקות לשמירת קבצים. אנא נסה לאפשר גישה לקבצים בהגדרות האפליקציה.', 'error');
            });
        } else {
            // שיטה רגילה לדפדפן - יצירת קישור להורדה והפעלתו
            const url = URL.createObjectURL(dataBlob);
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
    }
    
    // פונקציה לקבלת נתיב תיקיית ההורדות המועדפת
    function getDownloadsPath() {
        if (typeof cordova === 'undefined' || !cordova.file) {
            return null;
        }
        
        // אנדרואיד - ננסה קודם כל את תיקיית ההורדות הציבורית
        if (cordova.file.externalRootDirectory) {
            return cordova.file.externalRootDirectory + "Download/";
        }
        
        // חלופה באנדרואיד חדש יותר
        if (cordova.file.externalDownloadsDirectory) {
            return cordova.file.externalDownloadsDirectory;
        }
        
        // חלופה לאנדרואיד עם הרשאות שונות
        if (cordova.file.externalDataDirectory) {
            return cordova.file.externalDataDirectory;
        }
        
        // אם אין אפשרות לתיקיית הורדות חיצונית, נשתמש בתיקייה פנימית
        return cordova.file.dataDirectory;
    }
    
    // פונקציית מעבר לאחסון פנימי אם האחסון החיצוני לא עובד
    function fallbackToInternalStorage(fileName, dataBlob) {
        console.log("מנסה לשמור בתיקייה פנימית כברירת מחדל");
        
        if (typeof cordova === 'undefined' || !cordova.file) {
            showToast("לא ניתן למצוא אפשרות לשמירת הקובץ", 'error');
            return;
        }
        
        // ננסה בתיקייה פנימית שלא צריכה הרשאות מיוחדות
        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dirEntry) {
            console.log(`גישה לתיקייה פנימית: ${dirEntry.fullPath}`);
            
            dirEntry.getFile(fileName, { create: true, exclusive: false }, function(fileEntry) {
                fileEntry.createWriter(function(writer) {
                    writer.onwriteend = function() {
                        console.log(`הקובץ נשמר בתיקייה פנימית: ${fileEntry.nativeURL || fileEntry.fullPath}`);
                        showToast(`הנתונים יוצאו בהצלחה`, 'success', 3000);
                        
                        // לא משתמשים בפונקציית openExportedFile
                    };
                    
                    writer.onerror = function(err) {
                        console.error("שגיאה בכתיבה לקובץ פנימי:", err);
                        showToast("שגיאה בשמירת הקובץ", 'error');
                    };
                    
                    writer.write(dataBlob);
                });
            }, function(err) {
                console.error("שגיאה ביצירת קובץ פנימי:", err);
                showToast("לא ניתן לשמור את הקובץ", 'error');
            });
        }, function(err) {
            console.error("שגיאה בגישה לתיקייה פנימית:", err);
            showToast("שגיאה בגישה לתיקייה פנימית", 'error');
        });
    }

    // בקשת הרשאות גישה לאחסון
    function requestStoragePermission() {
        return new Promise((resolve, reject) => {
            // לאנדרואיד מגרסה 10 ומעלה יש גישה מוגבלת לאחסון חיצוני
            // בודקים אם מדובר באפליקציית Cordova על מכשיר Android
            if (typeof cordova !== 'undefined' && 
                cordova.plugins && 
                cordova.plugins.permissions) {
                
                console.log("מנסה לבקש הרשאות דרך cordova.plugins.permissions");
                showToast("מבקש הרשאות אחסון...", "info");
                
                const permissions = cordova.plugins.permissions;
                
                // מגדירים את כל ההרשאות שאנחנו צריכים
                const requiredPermissions = [
                    permissions.READ_EXTERNAL_STORAGE,
                    permissions.WRITE_EXTERNAL_STORAGE
                ];
                
                // מבקשים כל הרשאה בנפרד
                const requestAllPermissions = async () => {
                    for (const permission of requiredPermissions) {
                        try {
                            const checkResult = await new Promise((resolve, reject) => {
                                permissions.checkPermission(permission, status => {
                                    resolve(status);
                                }, error => {
                                    console.error("שגיאה בבדיקת הרשאה:", error);
                                    reject(error);
                                });
                            });
                            
                            if (!checkResult.hasPermission) {
                                console.log(`מבקש הרשאה: ${permission}`);
                                const requestResult = await new Promise((resolve, reject) => {
                                    permissions.requestPermission(permission, status => {
                                        resolve(status);
                                    }, error => {
                                        console.error("שגיאה בבקשת הרשאה:", error);
                                        reject(error);
                                    });
                                });
                                
                                if (!requestResult.hasPermission) {
                                    throw new Error(`לא ניתנה הרשאה: ${permission}`);
                                }
                            }
                        } catch (error) {
                            console.error("שגיאה בבקשת הרשאות:", error);
                            throw error;
                        }
                    }
                };
                
                // יוצרים פונקציה חלופית שבודקת אם זה Android 10 ומעלה
                const tryRequestLegacyStorage = async () => {
                    if (typeof cordova.InAppBrowser !== 'undefined') {
                        // פתרון חלופי: ננסה להשתמש בתיקייה פנימית
                        console.log("מנסה להשתמש בתיקייה פנימית במקום");
                        return true;
                    }
                    return false;
                };
                
                // ננסה לבקש את כל ההרשאות
                requestAllPermissions()
                    .then(() => {
                        console.log("כל ההרשאות התקבלו בהצלחה");
                        showToast("הרשאות אחסון התקבלו", "success");
                        resolve();
                    })
                    .catch(async (error) => {
                        console.error("שגיאה בבקשת הרשאות:", error);
                        
                        // ננסה דרך חלופית
                        const legacySuccess = await tryRequestLegacyStorage();
                        if (legacySuccess) {
                            resolve();
                        } else {
                            showToast("לא ניתן לקבל הרשאות אחסון. ייתכן שקובץ ייוצא לתיקייה פנימית של האפליקציה.", "warning");
                            resolve(); // נמשיך בכל מקרה ונשתמש בתיקייה פנימית
                        }
                    });
            } else if (typeof navigator !== 'undefined' && navigator.permissions) {
                // אלטרנטיבה לאפליקציות שאינן משתמשות ב-cordova
                console.log("מנסה לבקש הרשאות דרך navigator.permissions");
                
                navigator.permissions.query({ name: 'storage-access' })
                    .then(result => {
                        if (result.state === 'granted') {
                            resolve();
                        } else if (result.state === 'prompt') {
                            showToast('אנא אשר את הרשאות האחסון', 'info');
                            resolve();
                        } else {
                            showToast('לא ניתן לקבל הרשאות אחסון. הקובץ ייתכן שיישמר במיקום אחר.', 'warning');
                            resolve(); // נמשיך בכל מקרה
                        }
                    })
                    .catch(error => {
                        // אם אין תמיכה בבדיקת הרשאות, ננסה בכל מקרה
                        console.warn('שגיאה בבדיקת הרשאות:', error);
                        resolve();
                    });
            } else {
                // אם אין תמיכה בבדיקת הרשאות, נמשיך ונקווה לטוב
                console.log("אין אפשרות לבקש הרשאות, ממשיכים בלעדיהן");
                resolve();
            }
        });
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
        // מוסיף פרמטר נוסף true עבור חלון האזהרה המיוחד
        showDeleteConfirmation('האם אתה בטוח שברצונך למחוק את כל הנתונים? פעולה זו אינה ניתנת לביטול!', () => {
            showDeleteConfirmation('אזהרה אחרונה: כל הנתונים יימחקו לצמיתות. האם להמשיך?', () => {
                // גיבוי שקט לפני מחיקה - שימוש בפונקציה פנימית במקום exportData
                silentBackupBeforeReset();
                
                // מחיקת כל הנתונים מ-localStorage
                localStorage.clear();
                
                showToast('כל הנתונים נמחקו. מרענן את העמוד...');
                
                // רענון העמוד
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }, true);
        }, true);
    }
    
    // פונקציה לגיבוי שקט לפני איפוס
    function silentBackupBeforeReset() {
        try {
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
            
            // בדיקה אם יש נתונים לשמור
            if (Object.keys(data).length === 0) {
                console.log("אין נתונים לגיבוי לפני איפוס");
                return;
            }
            
            // יצירת מחרוזת JSON
            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            // שימוש ב-localStorage לשמירת גיבוי אחרון
            try {
                localStorage.setItem('_lastBackupBeforeReset', dataStr);
            } catch (e) {
                console.error("שגיאה בשמירת גיבוי ב-localStorage:", e);
            }
            
            // שמירת קובץ בשקט ברקע
            if (typeof cordova !== 'undefined' && cordova.file) {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const fileName = `mytrip-reset-backup-${timestamp}.json`;
                
                // ניסיון לשמור בתיקייה פנימית של האפליקציה
                if (cordova.file.dataDirectory) {
                    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dirEntry) {
                        dirEntry.getFile(fileName, { create: true, exclusive: false }, function(fileEntry) {
                            fileEntry.createWriter(function(writer) {
                                writer.onwriteend = function() {
                                    console.log(`גיבוי שקט נשמר ב: ${fileEntry.nativeURL || fileEntry.fullPath}`);
                                };
                                writer.write(dataBlob);
                            });
                        });
                    });
                }
            } else if (typeof window !== 'undefined') {
                // שמירה בזיכרון המטמון של הדפדפן
                if (sessionStorage) {
                    try {
                        sessionStorage.setItem('_lastBackupBeforeReset', dataStr);
                    } catch (e) {
                        console.error("שגיאה בשמירת גיבוי ב-sessionStorage:", e);
                    }
                }
            }
            
            console.log("בוצע גיבוי שקט לפני איפוס");
        } catch (e) {
            console.error("שגיאה בביצוע גיבוי שקט:", e);
        }
    }

    // הצגת הודעה למשתמש
    function showToast(message, type = 'success', duration = 3000) {
        // מחיקת toast קיים אם יש
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        // יצירת אלמנט toast חדש
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // הפעלת אנימציה
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // הסרת ה-toast אחרי הזמן שהוגדר
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300); // זמן לאנימציית fade out
        }, duration);
    }

    // אתחול הגדרות
    setupSettingsHandlers();

    // פונקציה להוספת מאזיני אירועים לכפתורי היום
    function setupDayButtonEvents() {
        document.querySelectorAll('.day-btn').forEach(btn => {
            // מוודאים שהכפתור לא כבר רשום לאירוע (למניעת רישום כפול)
            btn.removeEventListener('click', dayButtonClickHandler);
            btn.addEventListener('click', dayButtonClickHandler);
        });
    }
    
    // פונקציית טיפול בלחיצה על כפתור יום
    function dayButtonClickHandler(e) {
        console.log('Day button clicked:', this.dataset.day);
        document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        activeDay = this.dataset.day;
        console.log('Active day changed to:', activeDay);
        renderSchedule(); // זה יעדכן גם את השעה הדיפולטיבית דרך renderSchedule
    }

    // התחלת האזנה לכפתורי היום הקיימים
    setupDayButtonEvents();

    // פונקציות נגישה לאישור מחיקה
    function showDeleteConfirmation(message, deleteCallback, isSettingsDelete = false) {
        const modal = document.getElementById('confirm-delete-modal');
        const messageElement = document.getElementById('confirm-delete-message');
        const confirmButton = document.getElementById('confirm-delete-confirm');
        const cancelButton = document.getElementById('confirm-delete-cancel');
        
        // ניהול מחלקה מיוחדת למחיקת הגדרות
        if (isSettingsDelete) {
            modal.classList.add('settings-delete-modal');
        } else {
            modal.classList.remove('settings-delete-modal');
        }
        
        // הגדרת ההודעה
        if (message) {
            messageElement.textContent = message;
        } else {
            messageElement.textContent = 'האם למחוק את הפריט?';
        }
        
        // הוספת אייקונים לכפתורים
        confirmButton.innerHTML = '<i class="fas fa-trash-alt"></i> מחק';
        cancelButton.innerHTML = '<i class="fas fa-times"></i> ביטול';
        
        // סגירת כל החלונות האחרים קודם
        document.querySelectorAll('.modal.show').forEach(m => {
            if (m !== modal) m.classList.remove('show');
        });
        
        // פתיחת המודל
        modal.classList.add('show');
        
        // מחדש את האנימציה של האייקון
        const deleteIcon = modal.querySelector('.delete-icon-large');
        if (deleteIcon) {
            deleteIcon.style.animation = 'none';
            setTimeout(() => {
                deleteIcon.style.animation = 'trembleIcon 0.4s ease-in-out';
            }, 10);
        }
        
        // מיקוד על כפתור הביטול לנגישות טובה יותר (מניעת מחיקה בטעות)
        setTimeout(() => {
            cancelButton.focus();
        }, 100);
        
        // טיפול באירועי לחיצה
        const handleCancel = () => {
            closeDeleteConfirmation();
        };
        
        const handleConfirm = () => {
            closeDeleteConfirmation();
            if (typeof deleteCallback === 'function') {
                deleteCallback();
            }
        };
        
        const closeDeleteConfirmation = () => {
            modal.classList.remove('show');
            // הסרת המחלקה המיוחדת בעת סגירת החלון
            modal.classList.remove('settings-delete-modal');
            document.body.style.overflow = '';
            
            // הסרת מאזיני האירועים כדי למנוע כפילויות
            confirmButton.removeEventListener('click', handleConfirm);
            cancelButton.removeEventListener('click', handleCancel);
            document.querySelector('#confirm-delete-modal .close-btn').removeEventListener('click', handleCancel);
            document.removeEventListener('keydown', handleKeyPress);
            modal.removeEventListener('click', handleModalClick);
        };
        
        const handleKeyPress = (e) => {
            if (e.key === 'Escape') {
                handleCancel();
            } else if (e.key === 'Enter' && document.activeElement === confirmButton) {
                handleConfirm();
            }
        };
        
        const handleModalClick = (e) => {
            if (e.target === modal) {
                handleCancel();
            }
        };
        
        // מנטרל גלילה בגוף העמוד כשהמודל פתוח
        document.body.style.overflow = 'hidden';
        
        // הוספת מאזיני אירועים
        confirmButton.addEventListener('click', handleConfirm);
        cancelButton.addEventListener('click', handleCancel);
        document.querySelector('#confirm-delete-modal .close-btn').addEventListener('click', handleCancel);
        document.addEventListener('keydown', handleKeyPress);
        modal.addEventListener('click', handleModalClick);
    }

    // פונקציית עזר לפתיחת הקובץ שיוצא
    function openExportedFile(fileEntry) {
        // ננסה לפתוח את הקובץ שנשמר אם יש לנו את הפלאגין המתאים
        if (typeof cordova !== 'undefined' && cordova.plugins && cordova.plugins.fileOpener2) {
            try {
                const filePath = fileEntry.nativeURL || fileEntry.fullPath;
                console.log(`מנסה לפתוח את הקובץ: ${filePath}`);
                
                cordova.plugins.fileOpener2.open(
                    filePath,
                    'application/json',
                    {
                        error: function(e) {
                            console.error('שגיאה בפתיחת הקובץ:', e);
                            showToast('לא ניתן לפתוח את הקובץ אוטומטית. הקובץ נמצא ב: ' + filePath, 'warning', 8000);
                        },
                        success: function() {
                            console.log('הקובץ נפתח בהצלחה');
                        }
                    }
                );
            } catch (err) {
                console.error('שגיאה בניסיון לפתוח את הקובץ:', err);
                showToast('אירעה שגיאה בפתיחת הקובץ. נסה לגשת אליו דרך מנהל הקבצים.', 'warning');
            }
        } else {
            const filePath = fileEntry.nativeURL || fileEntry.fullPath;
            console.log('אין אפשרות לפתוח את הקובץ אוטומטית. נתיב הקובץ:', filePath);
            showToast('הקובץ נשמר ב: ' + filePath, 'info', 8000);
        }
    }
}); 