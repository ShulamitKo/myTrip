/**
 * ניהול לשונית המשימות
 */
import TaskManager from '../models/TaskManager.js';
import { showToast, openModal, closeAllModals, showDeleteConfirmation } from '../utils/ui.js';

// יצירת מופע של מנהל המשימות
const taskManager = new TaskManager();

/**
 * אתחול לשונית המשימות
 */
export function initTasksTab() {
    // קישור אירועים
    document.getElementById('addTaskBtn').addEventListener('click', addTask);
    document.getElementById('taskInput').addEventListener('keypress', e => {
        if (e.key === 'Enter') addTask();
    });
    
    // קישור לחצני סינון
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderTasks();
        });
    });
    
    // אתחול מודאל עריכה
    document.querySelector('#edit-task-modal .close-btn').addEventListener('click', closeAllModals);
    document.querySelector('#edit-task-form button[type="button"]').addEventListener('click', closeAllModals);
    document.getElementById('edit-task-form').addEventListener('submit', e => {
        e.preventDefault();
        
        const id = document.getElementById('edit-task-id').value;
        const text = document.getElementById('edit-task-text').value;
        const priority = document.getElementById('edit-task-priority').value;
        const completed = document.getElementById('edit-task-completed').checked;
        
        taskManager.updateItem(id, { text, priority, completed });
        renderTasks();
        closeAllModals();
        showToast('המשימה עודכנה בהצלחה');
    });
    
    // רינדור ראשוני של המשימות
    renderTasks();
}

/**
 * הוספת משימה חדשה
 */
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const text = taskInput.value.trim();
    
    if (text) {
        const task = {
            id: Date.now().toString(),
            text,
            priority: 'medium',
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        taskManager.addItem(task);
        taskInput.value = '';
        renderTasks();
        showToast('המשימה נוספה בהצלחה');
    }
}

/**
 * עריכת משימה קיימת
 * @param {Object} task - המשימה לעריכה
 */
function editTask(task) {
    document.getElementById('edit-task-id').value = task.id;
    document.getElementById('edit-task-text').value = task.text;
    document.getElementById('edit-task-priority').value = task.priority || 'medium';
    document.getElementById('edit-task-completed').checked = task.completed || false;
    
    openModal('edit-task-modal');
}

/**
 * רינדור רשימת המשימות
 */
function renderTasks() {
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyTasksState');
    
    // קבלת המשימות
    let tasks = taskManager.getAllItems();
    
    // סינון המשימות לפי הפילטר הפעיל
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    
    switch (activeFilter) {
        case 'active':
            tasks = tasks.filter(task => !task.completed);
            break;
        case 'completed':
            tasks = tasks.filter(task => task.completed);
            break;
        case 'high':
            tasks = tasks.filter(task => task.priority === 'high');
            break;
    }
    
    // מיון המשימות - תחילה לא הושלמו, אחר כך לפי עדיפות
    tasks.sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        const priorityA = priorityOrder[a.priority] || 2;
        const priorityB = priorityOrder[b.priority] || 2;
        
        return priorityA - priorityB;
    });
    
    // הצגת/הסתרת מצב ריק
    if (tasks.length === 0) {
        taskList.style.display = 'none';
        emptyState.style.display = 'flex';
    } else {
        taskList.style.display = 'block';
        emptyState.style.display = 'none';
    }
    
    // רינדור המשימות
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.dataset.priority = task.priority || 'medium';
        
        // קביעת אייקון העדיפות
        const priorityIcon = 
            task.priority === 'high' ? '<i class="fas fa-exclamation-circle"></i>' :
            task.priority === 'medium' ? '<i class="fas fa-circle"></i>' :
            '<i class="fas fa-arrow-circle-down"></i>';
        
        // בניית תוכן המשימה
        taskItem.innerHTML = `
            <div class="task-content">
                <div class="checkbox ${task.completed ? 'checked' : ''}" data-id="${task.id}" title="${task.completed ? 'סמן כלא הושלם' : 'סמן כהושלם'}"></div>
                <div class="task-priority ${task.priority || 'medium'}">${priorityIcon}</div>
                <div class="task-text">${task.text}</div>
            </div>
            <div class="task-actions">
                <button class="task-action priority-action" data-id="${task.id}" title="שנה עדיפות">
                    <i class="fas fa-flag"></i>
                </button>
                <button class="task-action edit-btn" title="ערוך משימה">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="task-action delete-btn" title="מחק משימה">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // הוספת מאזיני אירועים
        taskItem.querySelector('.checkbox').addEventListener('click', () => {
            taskManager.toggleComplete(task.id);
            renderTasks();
        });
        
        // מאזין אירועים לשינוי עדיפות בלחיצה על אייקון הדגל
        taskItem.querySelector('.priority-action').addEventListener('click', () => {
            const priorities = ['low', 'medium', 'high'];
            const currentIndex = priorities.indexOf(task.priority || 'medium');
            const nextIndex = (currentIndex + 1) % priorities.length;
            
            taskManager.updateItem(task.id, { priority: priorities[nextIndex] });
            renderTasks();
        });
        
        // מאזין אירועים נוסף לשינוי עדיפות בלחיצה ישירה על אייקון העדיפות
        taskItem.querySelector('.task-priority').addEventListener('click', () => {
            const priorities = ['low', 'medium', 'high'];
            const currentIndex = priorities.indexOf(task.priority || 'medium');
            const nextIndex = (currentIndex + 1) % priorities.length;
            
            taskManager.updateItem(task.id, { priority: priorities[nextIndex] });
            renderTasks();
        });
        
        taskItem.querySelector('.edit-btn').addEventListener('click', () => {
            editTask(task);
        });
        
        taskItem.querySelector('.delete-btn').addEventListener('click', () => {
            showDeleteConfirmation('האם אתה בטוח שברצונך למחוק את המשימה הזו?', () => {
                taskManager.deleteItem(task.id);
                renderTasks();
                showToast('המשימה נמחקה בהצלחה');
            });
        });
        
        // אירוע לחיצה על הטקסט לעריכה מהירה
        taskItem.querySelector('.task-text').addEventListener('click', () => {
            editTask(task);
        });
        
        taskList.appendChild(taskItem);
    });
}

export { renderTasks }; 