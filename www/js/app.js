/**
 * הקובץ הראשי של האפליקציה
 */
import { initTasksTab } from './tabs/tasks.js';
import { initShoppingTab } from './tabs/shopping.js';
import { initPlacesTab } from './tabs/places.js';
import { initFoodTab } from './tabs/food.js';
import { initScheduleTab } from './tabs/schedule.js';
import { initInfoTab } from './tabs/info.js';
import { showToast, setupSettingsHandlers, loadAllComponents } from './utils/ui.js';

// אתחול אזורים בטוחים למכשירים מודרניים
function initializeDeviceCompat() {
    // בדיקה האם המכשיר תומך ב-safe area
    if (window.Capacitor) {
        try {
            const safeArea = window.Capacitor.Plugins.SafeArea;
            if (safeArea) {
                safeArea.getSafeAreaInsets().then(({ insets }) => {
                    document.documentElement.style.setProperty('--safe-area-top', `${insets.top}px`);
                    document.documentElement.style.setProperty('--safe-area-bottom', `${insets.bottom}px`);
                    document.documentElement.style.setProperty('--safe-area-left', `${insets.left}px`);
                    document.documentElement.style.setProperty('--safe-area-right', `${insets.right}px`);
                    
                    console.log('Safe area insets applied:', insets);
                }).catch(err => {
                    console.error('Error getting safe area:', err);
                });
                
                safeArea.addListener('safeAreaChanged', ({ insets }) => {
                    document.documentElement.style.setProperty('--safe-area-top', `${insets.top}px`);
                    document.documentElement.style.setProperty('--safe-area-bottom', `${insets.bottom}px`);
                    document.documentElement.style.setProperty('--safe-area-left', `${insets.left}px`);
                    document.documentElement.style.setProperty('--safe-area-right', `${insets.right}px`);
                    
                    console.log('Safe area insets updated:', insets);
                });
            }
        } catch (err) {
            console.error('Safe area plugin not available:', err);
        }
        
        // סטטוס בר
        try {
            const { StatusBar } = window.Capacitor.Plugins;
            if (StatusBar) {
                StatusBar.setBackgroundColor({ color: '#4a6da7' });
                StatusBar.setStyle({ style: 'LIGHT' });
            }
        } catch (error) {
            console.error('Status bar plugin error:', error);
        }
    } else {
        console.log('Running in browser mode, skipping native plugins');
    }
}

/**
 * מעבר בין לשוניות באפליקציה
 * @param {string} tabId - המזהה של הלשונית
 */
function switchTab(tabId) {
    // עדכון הלשוניות העליונות
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabId);
    });
    
    // עדכון תוכן הלשוניות
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === tabId);
    });
    
    // עדכון תפריט התחתון
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.tab === tabId);
    });
    
    // שמירת הלשונית האחרונה שהייתה פעילה
    localStorage.setItem('lastActiveTab', tabId);
}

/**
 * עריכת כותרת הטיול
 */
function editTitle() {
    const titleEl = document.getElementById('appTitle');
    const currentTitle = titleEl.textContent;
    
    // יצירת שדה קלט לעריכה
    titleEl.classList.add('editing');
    titleEl.innerHTML = `<input type="text" id="titleInput" value="${currentTitle}" maxlength="30">`;
    
    const titleInput = document.getElementById('titleInput');
    titleInput.focus();
    titleInput.select();
    
    // מאזין לאירוע אנטר
    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            finishTitleEditing();
        }
    };
    
    // מאזין לאירוע איבוד פוקוס
    const handleBlur = () => {
        finishTitleEditing();
    };
    
    // פונקציה לסיום העריכה
    function finishTitleEditing() {
        const newTitle = titleInput.value.trim() || 'הטיול שלי';
        titleEl.classList.remove('editing');
        titleEl.textContent = newTitle;
        
        // הסרת המאזינים
        titleInput.removeEventListener('keypress', handleEnter);
        titleInput.removeEventListener('blur', handleBlur);
        
        // שמירת הכותרת החדשה
        localStorage.setItem('appTitle', newTitle);
        showToast('כותרת הטיול עודכנה בהצלחה');
    }
    
    // הוספת מאזיני אירועים
    titleInput.addEventListener('keypress', handleEnter);
    titleInput.addEventListener('blur', handleBlur);
}

/**
 * אתחול האפליקציה בטעינת העמוד
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM Content Loaded');
    
    try {
        // טעינת כל הרכיבים המודולריים
        console.log('טוען רכיבים מודולריים...');
        await loadAllComponents();
        console.log('טעינת רכיבים הושלמה בהצלחה!');
    } catch (error) {
        console.error('שגיאה בטעינת רכיבים:', error);
        // הצגת שגיאה גם בממשק המשתמש במקרה של תקלה
        const errorMessage = document.createElement('div');
        errorMessage.style.color = 'red';
        errorMessage.style.padding = '20px';
        errorMessage.style.margin = '20px';
        errorMessage.style.border = '1px solid red';
        errorMessage.innerHTML = `<h2>שגיאה בטעינת הרכיבים</h2>
            <p>${error.message}</p>
            <p>נא לרענן את העמוד או לפנות לתמיכה.</p>`;
        document.body.prepend(errorMessage);
    }
    
    // אתחול אזורים בטוחים
    initializeDeviceCompat();
    
    // טעינת כותרת הטיול השמורה
    const savedTitle = localStorage.getItem('appTitle');
    if (savedTitle) {
        document.getElementById('appTitle').textContent = savedTitle;
    }
    
    // הוספת מאזיני אירועים ללשוניות
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => switchTab(item.dataset.tab));
    });
    
    // הוספת כפתור עריכת כותרת
    document.querySelector('.edit-title-btn').addEventListener('click', editTitle);
    
    // אתחול הלשוניות
    initTasksTab();
    initShoppingTab();
    initPlacesTab();
    initFoodTab();
    initScheduleTab();
    initInfoTab();
    
    // מעבר ללשונית האחרונה שהייתה פעילה
    const lastActiveTab = localStorage.getItem('lastActiveTab') || 'tasks';
    switchTab(lastActiveTab);
    
    // אתחול הגדרות האפליקציה
    setupSettingsHandlers();
}); 