/**
 * ניהול לשונית המידע השימושי
 */
import InfoManager from '../models/InfoManager.js';
import { showToast, openModal, closeAllModals, showDeleteConfirmation } from '../utils/ui.js';

// יצירת מופע של מנהל המידע
const infoManager = new InfoManager();

/**
 * אתחול לשונית המידע
 */
export function initInfoTab() {
    // קישור אירועים
    document.getElementById('addInfoBtn').addEventListener('click', addInfo);
    document.getElementById('infoInput').addEventListener('keypress', e => {
        if (e.key === 'Enter') addInfo();
    });
    
    // קישור טפסים
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
    
    // מאזין אירועים לכפתור הוספת פריט מידע
    document.getElementById('add-info-item-btn').addEventListener('click', () => {
        addInfoItemRow();
    });
    
    // רינדור ראשוני
    renderInfo();
    
    // הוספת נתוני דוגמה אם אין מידע
    if (infoManager.getAllItems().length === 0) {
        addSampleInfo();
    }
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

/**
 * פונקציות מידע - זהות לאלו שבקובץ script.js
 */

// הוספת כרטיס מידע
function addInfo() {
    const title = document.getElementById('infoInput').value.trim();
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
        
        document.getElementById('infoInput').value = '';
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

// רינדור המידע
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
            infoManager.updateItem(info.id, updatedInfo);
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

// פונקציה להוספת נתוני דוגמה
function addSampleInfo() {
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

export { renderInfo }; 