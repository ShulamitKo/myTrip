/**
 * ניהול לשונית הלו"ז
 */
import ScheduleManager from '../models/ScheduleManager.js';
import DaysManager from '../models/DaysManager.js';
import { showToast, openModal, closeAllModals, showDeleteConfirmation } from '../utils/ui.js';
import { calculateEndTime, formatTime, formatDuration } from '../utils/time.js';

// יצירת מופע של מנהל הלו"ז
const scheduleManager = new ScheduleManager();
const daysManager = new DaysManager();

/**
 * אתחול לשונית הלו"ז
 */
export function initScheduleTab() {
    // קישור אירועים
    document.getElementById('addScheduleBtn').addEventListener('click', addScheduleItem);
    document.getElementById('scheduleInput').addEventListener('keypress', e => {
        if (e.key === 'Enter') addScheduleItem();
    });
    
    // קישור מודאל עריכה
    document.querySelector('#edit-schedule-modal .close-btn').addEventListener('click', closeAllModals);
    document.querySelector('#edit-schedule-form .close-modal').addEventListener('click', closeAllModals);
    document.getElementById('edit-schedule-form').addEventListener('submit', e => {
        e.preventDefault();
        
        const id = document.getElementById('edit-schedule-id').value;
        const text = document.getElementById('edit-schedule-text').value;
        const time = document.getElementById('edit-schedule-time').value;
        const category = document.getElementById('edit-schedule-category').value;
        const location = document.getElementById('edit-schedule-location').value;
        const notes = document.getElementById('edit-schedule-notes').value;
        const completed = document.getElementById('edit-schedule-completed').checked;
        
        // קבלת היום הפעיל
        const activeDay = document.querySelector('.day-btn.active');
        const dayNumber = activeDay ? activeDay.dataset.day : '1';
        
        if (id) {
            // עדכון פעילות קיימת
            scheduleManager.updateItem(id, {
                text,
                time,
                category,
                location,
                notes,
                completed
            });
            
            showToast('הפעילות עודכנה בהצלחה');
        } else {
            // הוספת פעילות חדשה
            const newItem = {
                id: Date.now().toString(),
                text,
                time,
                day: dayNumber,
                category,
                location,
                notes,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            scheduleManager.addItem(newItem);
            showToast('הפעילות נוספה בהצלחה');
            
            // איפוס שדה הקלט לאחר הוספה
            document.getElementById('scheduleInput').value = '';
        }
        
        renderSchedule();
        closeAllModals();
    });
    
    // קישור אירועי ימים
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.addEventListener('click', dayButtonClickHandler);
    });
    
    document.querySelector('.add-day-btn').addEventListener('click', () => {
        // הוספת יום חדש
        const newDay = daysManager.addDay();
        renderSchedule();
        showToast(`יום ${newDay.number} נוסף בהצלחה`);
        updateDayButtons();
    });
    
    document.querySelector('.edit-days-btn').addEventListener('click', openEditDaysModal);
    
    // אתחול מודאל ניהול ימים
    setupEditDaysModal();
    
    // רינדור ראשוני של לו"ז
    updateDayButtons();
    renderSchedule();
}

/**
 * אתחול מודאל עריכת ימים
 */
function setupEditDaysModal() {
    // קישור כפתורי הפעולה במודאל
    document.getElementById('add-day-item-btn').addEventListener('click', () => {
        const newDay = daysManager.addDay();
        updateDaysList();
        showToast(`יום ${newDay.number} נוסף בהצלחה`);
    });
    
    document.getElementById('save-days-btn').addEventListener('click', saveDaysChanges);
    document.getElementById('cancel-days-btn').addEventListener('click', closeAllModals);
    document.querySelector('#edit-days-modal .close-btn').addEventListener('click', closeAllModals);
}

/**
 * פתיחת מודאל עריכת ימים
 */
function openEditDaysModal() {
    // עדכון הרשימה
    updateDaysList();
    openModal('edit-days-modal');
}

/**
 * עדכון רשימת הימים במודאל
 */
function updateDaysList() {
    const daysList = document.getElementById('days-list');
    daysList.innerHTML = '';
    
    // קבלת הימים ממוינים לפי סדר
    const days = daysManager.getDays();
    
    days.forEach(day => {
        const dayItem = document.createElement('li');
        dayItem.className = 'day-item';
        dayItem.dataset.id = day.id;
        dayItem.dataset.number = day.number;
        
        dayItem.innerHTML = `
            <div class="day-handle"><i class="fas fa-grip-lines"></i></div>
            <span class="day-name">${day.name}</span>
            <div class="day-actions">
                <button class="day-edit-btn" title="ערוך שם היום"><i class="fas fa-edit"></i></button>
                <button class="day-delete-btn" title="מחק יום"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        // הוספת אירועי עריכה ומחיקה
        attachEditEvent(dayItem);
        attachDeleteEvent(dayItem);
        
        daysList.appendChild(dayItem);
    });
    
    setupDaysListEvents();
}

/**
 * קישור אירועי גרירה ושחרור לרשימת הימים
 */
function setupDaysListEvents() {
    const daysList = document.getElementById('days-list');
    const dayItems = daysList.querySelectorAll('.day-item');
    
    dayItems.forEach(item => {
        setupDragAndDropEvents(item);
    });
    
    daysList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        if (!draggingItem) return;
        
        const siblings = [...daysList.querySelectorAll('.day-item:not(.dragging)')];
        const nextSibling = siblings.find(sibling => {
            const box = sibling.getBoundingClientRect();
            const offset = e.clientY - box.top - box.height / 2;
            return offset < 0;
        });
        
        if (nextSibling) {
            daysList.insertBefore(draggingItem, nextSibling);
        } else {
            daysList.appendChild(draggingItem);
        }
    });
}

/**
 * קישור אירועי גרירה לפריט יום
 */
function setupDragAndDropEvents(item) {
    // יישום לוגיקת הגרירה - אירועים אלה יוגדרו כאן
    item.draggable = true;
    
    item.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', item.dataset.id);
        item.classList.add('dragging');
    });
    
    item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
    });
    
    item.addEventListener('dragover', e => {
        e.preventDefault();
    });
    
    item.addEventListener('dragenter', e => {
        e.preventDefault();
        item.classList.add('drag-over');
    });
    
    item.addEventListener('dragleave', () => {
        item.classList.remove('drag-over');
    });
    
    item.addEventListener('drop', e => {
        e.preventDefault();
        item.classList.remove('drag-over');
        
        const draggedId = e.dataTransfer.getData('text/plain');
        const draggedItem = document.querySelector(`.day-item[data-id="${draggedId}"]`);
        
        if (draggedItem && draggedItem !== item) {
            const list = item.parentNode;
            
            // בדיקה האם גוררים למעלה או למטה
            const draggingDown = [...list.children].indexOf(draggedItem) < [...list.children].indexOf(item);
            
            if (draggingDown) {
                list.insertBefore(draggedItem, item.nextSibling);
            } else {
                list.insertBefore(draggedItem, item);
            }
        }
    });
}

/**
 * שמירת שינויים ברשימת הימים
 */
function saveDaysChanges() {
    const daysList = document.getElementById('days-list');
    const orderedDays = [];
    const daysToDelete = [];
    
    // קבלת כל הימים שמסומנים למחיקה
    const markedForDeleteItems = daysList.querySelectorAll('.day-item.marked-for-delete');
    markedForDeleteItems.forEach(item => {
        const dayNumber = item.dataset.number;
        const dayId = item.dataset.id;
        
        // איסוף פרטי הימים למחיקה
        daysToDelete.push({
            id: dayId,
            number: dayNumber
        });
    });
    
    // מחיקת הימים והפעילויות שלהם בפועל
    daysToDelete.forEach(day => {
        // בדיקה אם יש פעילויות ליום זה
        const activities = scheduleManager.getActivitiesForDay(day.number);
        
        // מחיקת כל הפעילויות של היום
        activities.forEach(activity => {
            scheduleManager.deleteItem(activity.id);
        });
        
        // מחיקת היום עצמו
        daysManager.deleteDay(day.id);
    });
    
    // איסוף הימים שלא נמחקו לפי הסדר החדש
    daysList.querySelectorAll('.day-item:not(.marked-for-delete)').forEach((item, index) => {
        const dayId = item.dataset.id;
        const dayNumber = item.dataset.number;
        const dayName = item.querySelector('.day-name').textContent;
        
        orderedDays.push({
            id: dayId,
            number: parseInt(dayNumber),
            name: dayName,
            order: index + 1
        });
    });
    
    // קבלת היום הפעיל הנוכחי
    const activeDay = document.querySelector('.day-btn.active');
    const activeNumber = activeDay ? activeDay.dataset.day : '1';
    
    // בדיקה אם היום הפעיל עדיין קיים
    const activeNumberExists = orderedDays.some(day => day.number.toString() === activeNumber);
    
    // עדכון סדר הימים
    daysManager.updateDayOrder(orderedDays);
    
    // אם היום הפעיל לא קיים יותר, נעבור ליום הראשון
    if (!activeNumberExists && orderedDays.length > 0) {
        // היום הפעיל יעודכן ב-updateDayButtons
    }
    
    // עדכון כפתורי היום
    updateDayButtons();
    
    closeAllModals();
    
    // הצגת הודעת הצלחה מתאימה
    if (daysToDelete.length > 0) {
        if (daysToDelete.length === 1) {
            showToast(`יום ${daysToDelete[0].number} נמחק בהצלחה`);
        } else {
            showToast(`${daysToDelete.length} ימים נמחקו בהצלחה`);
        }
    } else {
        showToast('השינויים בימים נשמרו בהצלחה');
    }
    
    // רענון הלו"ז
    renderSchedule();
}

/**
 * הוספת אירוע עריכה לפריט יום
 */
function attachEditEvent(dayElement) {
    const editBtn = dayElement.querySelector('.day-edit-btn');
    
    editBtn.addEventListener('click', () => {
        const dayName = dayElement.querySelector('.day-name');
        const currentText = dayName.textContent;
        
        // יצירת תיבת טקסט לעריכה
        dayName.innerHTML = `<input type="text" class="day-input" value="${currentText}">`;
        const input = dayName.querySelector('input');
        input.focus();
        input.select();
        
        // יציאה מהעריכה בלחיצה על אנטר או איבוד פוקוס
        input.addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                finishEditing(input, dayElement);
            }
        });
        
        input.addEventListener('blur', () => {
            finishEditing(input, dayElement);
        });
    });
}

/**
 * סיום עריכת שם יום
 */
function finishEditing(input, dayElement) {
    const dayName = dayElement.querySelector('.day-name');
    const dayId = dayElement.dataset.id;
    const newValue = input.value.trim() || `יום ${dayElement.dataset.number}`;
    
    // עדכון השם
    dayName.textContent = newValue;
    
    // עדכון המודל
    daysManager.updateItem(dayId, { name: newValue });
}

/**
 * הוספת אירוע מחיקה לפריט יום
 */
function attachDeleteEvent(dayElement) {
    const deleteBtn = dayElement.querySelector('.day-delete-btn');
    
    deleteBtn.addEventListener('click', () => {
        const dayNumber = dayElement.dataset.number;
        const dayId = dayElement.dataset.id;
        const activities = scheduleManager.getActivitiesForDay(dayNumber);
        
        let confirmMessage = `האם למחוק את יום ${dayNumber}?`;
        if (activities.length > 0) {
            confirmMessage = `ליום ${dayNumber} יש ${activities.length} פעילויות. מחיקת היום תמחק גם את כל הפעילויות. האם להמשיך?`;
        }
        
        showDeleteConfirmation(confirmMessage, () => {
            // הוספת קלאס מחיקה ותצוגת מצב מחיקה
            dayElement.classList.add('deleting');
            
            // סימון היום כמיועד למחיקה (לא מוחקים בפועל עד ללחיצה על "שמור שינויים")
            dayElement.classList.add('marked-for-delete');
            
            // הוספת אפשרות ביטול מחיקה
            const dayActions = dayElement.querySelector('.day-actions');
            const originalContent = dayActions.innerHTML;
            
            // שמירת תוכן מקורי לשימוש בביטול
            dayElement.dataset.originalContent = originalContent;
            
            // הצגת כפתורי ביטול/אישור מחיקה
            dayActions.innerHTML = `
                <div class="delete-confirmation-actions">
                    <button class="cancel-delete-day-btn" title="בטל מחיקה">
                        <i class="fas fa-undo"></i> בטל
                    </button>
                </div>
            `;
            
            // הוספת הודעת אזהרה
            const warningElement = document.createElement('div');
            warningElement.className = 'day-warning-text';
            warningElement.innerHTML = '<i class="fas fa-exclamation-triangle"></i> יימחק בשמירה';
            dayElement.appendChild(warningElement);
            
            // הוספת אירוע לכפתור ביטול מחיקה
            const cancelDeleteBtn = dayElement.querySelector('.cancel-delete-day-btn');
            cancelDeleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // הסרת סימון המחיקה
                dayElement.classList.remove('deleting', 'marked-for-delete');
                
                // שחזור התוכן המקורי
                dayActions.innerHTML = dayElement.dataset.originalContent;
                
                // הסרת הודעת האזהרה
                const warningText = dayElement.querySelector('.day-warning-text');
                if (warningText) {
                    warningText.remove();
                }
                
                // שחזור אירועי העריכה והמחיקה
                attachEditEvent(dayElement);
                attachDeleteEvent(dayElement);
                
                showToast(`ביטול מחיקת יום ${dayNumber}`, 'success');
            });
        });
    });
}

/**
 * עדכון כפתורי הימים
 */
function updateDayButtons() {
    const daySelector = document.querySelector('.day-selector');
    const days = daysManager.getDays();
    
    // שמירת כפתורי ההוספה והעריכה
    const addDayBtn = daySelector.querySelector('.add-day-btn');
    const editDaysBtn = daySelector.querySelector('.edit-days-btn');
    
    // ניקוי כל כפתורי היום הקיימים
    document.querySelectorAll('.day-btn:not(.add-day-btn):not(.edit-days-btn)').forEach(btn => {
        btn.remove();
    });
    
    // יצירת כפתורים מעודכנים
    days.forEach(day => {
        const dayBtn = document.createElement('button');
        dayBtn.className = 'day-btn';
        dayBtn.dataset.day = day.number.toString();
        dayBtn.textContent = day.name;
        dayBtn.title = `הצג לו"ז ליום ${day.number}`;
        dayBtn.addEventListener('click', dayButtonClickHandler);
        
        // הוספה לפני כפתור ההוספה
        daySelector.insertBefore(dayBtn, addDayBtn);
    });
    
    // סימון היום הראשון כפעיל אם אין יום פעיל
    const activeDay = daySelector.querySelector('.day-btn.active');
    if (!activeDay && days.length > 0) {
        const firstDayBtn = daySelector.querySelector('.day-btn[data-day="1"]');
        if (firstDayBtn) {
            firstDayBtn.classList.add('active');
        }
    }
}

/**
 * טיפול בלחיצה על כפתור יום
 */
function dayButtonClickHandler(e) {
    const dayBtn = e.target.closest('.day-btn');
    if (!dayBtn) return;
    
    // הסרת סימון פעיל מכל הכפתורים
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // סימון הכפתור הנוכחי כפעיל
    dayBtn.classList.add('active');
    
    // רינדור מחדש של הלו"ז
    renderSchedule();
}

/**
 * הוספת פעילות חדשה ללו"ז
 */
function addScheduleItem() {
    const scheduleInput = document.getElementById('scheduleInput');
    const scheduleText = scheduleInput.value.trim();
    
    // קבלת היום הפעיל
    const activeDay = document.querySelector('.day-btn.active');
    if (!activeDay) {
        showToast('אנא בחר יום תחילה', 'error');
        return;
    }
    
    // איפוס הטופס
    document.getElementById('edit-schedule-form').reset();
    document.getElementById('edit-schedule-id').value = '';
    
    // הגדרת ערכי ברירת מחדל
    document.getElementById('edit-schedule-text').value = scheduleText;
    
    // קביעת שעה ברירת מחדל לפעילות חדשה
    const scheduleTime = document.getElementById('scheduleTime');
    document.getElementById('edit-schedule-time').value = scheduleTime.value || '09:00';
    
    document.getElementById('edit-schedule-category').value = 'other';
    document.getElementById('edit-schedule-completed').checked = false;
    
    // פתיחת המודאל
    openModal('edit-schedule-modal');
    
    // ניקוי שדה הקלט בממשק הראשי (אם מבטלים את ההוספה)
    scheduleInput.value = '';
}

/**
 * עריכת פעילות קיימת
 * @param {Object} activity - הפעילות לעריכה
 */
function editScheduleItem(activity) {
    // איפוס הטופס
    document.getElementById('edit-schedule-form').reset();
    
    // מילוי הטופס בנתוני הפעילות
    document.getElementById('edit-schedule-id').value = activity.id;
    document.getElementById('edit-schedule-text').value = activity.text;
    document.getElementById('edit-schedule-time').value = activity.time;
    document.getElementById('edit-schedule-category').value = activity.category || 'other';
    document.getElementById('edit-schedule-location').value = activity.location || '';
    document.getElementById('edit-schedule-notes').value = activity.notes || '';
    document.getElementById('edit-schedule-completed').checked = activity.completed || false;
    
    // פתיחת המודאל
    openModal('edit-schedule-modal');
}

/**
 * רינדור לוח הזמנים
 */
function renderSchedule() {
    const scheduleList = document.getElementById('scheduleList');
    const emptyState = document.getElementById('emptyScheduleState');
    
    // קבלת היום הפעיל
    const activeDay = document.querySelector('.day-btn.active');
    if (!activeDay) {
        // אין יום פעיל, נסתיר את הכל
        scheduleList.style.display = 'none';
        emptyState.style.display = 'none';
        return;
    }
    
    const dayNumber = activeDay.dataset.day;
    
    // קבלת הפעילויות של היום הנבחר
    let activities = scheduleManager.getActivitiesForDay(dayNumber);
    
    // מיון הפעילויות לפי שעה
    activities.sort((a, b) => {
        return a.time.localeCompare(b.time);
    });
    
    // עדכון שעת ברירת המחדל להוספת פעילות חדשה
    updateDefaultScheduleTime(activities);
    
    // הצגת/הסתרת מצב ריק
    if (activities.length === 0) {
        scheduleList.style.display = 'none';
        emptyState.style.display = 'flex';
    } else {
        scheduleList.style.display = 'block';
        emptyState.style.display = 'none';
    }
    
    // רינדור הפעילויות
    scheduleList.innerHTML = '';
    
    activities.forEach(activity => {
        const timeBlock = document.createElement('div');
        timeBlock.className = `time-block ${activity.completed ? 'completed' : ''}`;
        
        // קביעת קטגוריה
        let categoryIcon = '';
        switch (activity.category) {
            case 'attraction': categoryIcon = 'fa-map-marker-alt'; break;
            case 'food': categoryIcon = 'fa-utensils'; break;
            case 'transport': categoryIcon = 'fa-bus'; break;
            case 'hotel': categoryIcon = 'fa-hotel'; break;
            case 'shopping': categoryIcon = 'fa-shopping-bag'; break;
            case 'meeting': categoryIcon = 'fa-users'; break;
            case 'relax': categoryIcon = 'fa-umbrella-beach'; break;
            default: categoryIcon = 'fa-calendar-day';
        }
        
        timeBlock.innerHTML = `
            <div class="time-block-time">
                <div class="start-time">${formatTime(activity.time)}</div>
            </div>
            <div class="time-block-content">
                <div class="time-block-text">${activity.text}</div>
                <div class="time-block-category-container">
                    <div class="time-block-category">
                        <i class="fas ${categoryIcon}"></i>
                    </div>
                    ${activity.location ? `
                    <div class="time-block-location">
                        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.location)}" 
                           target="_blank" class="time-block-btn map-action" title="פתח את המיקום בגוגל מפס (ייפתח בחלון חדש)">
                            <i class="fas fa-map-marked-alt"></i>
                        </a>
                        <span class="location-text">${activity.location}</span>
                    </div>` : ''}
                </div>
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
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // הוספת מאזיני אירועים
        timeBlock.querySelector('.time-block-btn.complete').addEventListener('click', () => {
            const newCompletedState = !activity.completed;
            scheduleManager.updateItem(activity.id, { completed: newCompletedState });
            renderSchedule();
            showToast(newCompletedState ? 'הפעילות סומנה כהושלמה' : 'הפעילות סומנה כלא הושלמה');
        });
        
        timeBlock.querySelector('.time-block-btn.edit').addEventListener('click', () => {
            editScheduleItem(activity);
        });
        
        timeBlock.querySelector('.time-block-btn.delete').addEventListener('click', () => {
            showDeleteConfirmation('האם אתה בטוח שברצונך למחוק את הפעילות הזו?', () => {
                scheduleManager.deleteItem(activity.id);
                renderSchedule();
                showToast('הפעילות נמחקה בהצלחה');
            });
        });
        
        scheduleList.appendChild(timeBlock);
    });
}

/**
 * עדכון שעת ברירת המחדל בשדה השעה
 */
function updateDefaultScheduleTime(activities) {
    const scheduleTime = document.getElementById('scheduleTime');
    
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

export { renderSchedule }; 