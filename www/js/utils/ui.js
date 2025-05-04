/**
 * פונקציות עזר לממשק המשתמש
 */

/**
 * פתיחת מודאל
 * @param {string} modalId - המזהה של המודאל לפתיחה
 */
export function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

/**
 * סגירת כל המודאלים הפתוחים
 */
export function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('show');
    });
}

/**
 * סגירת מודאל ספציפי
 * @param {HTMLElement} modal - אלמנט המודאל לסגירה
 */
export function closeInlineModal(modal) {
    modal.classList.remove('show');
}

/**
 * הצגת הודעת טוסט למשתמש
 * @param {string} message - ההודעה להצגה
 * @param {string} type - סוג ההודעה (success/error/warning)
 * @param {number} duration - משך הזמן בשניות להצגת ההודעה
 */
export function showToast(message, type = 'success', duration = 3000) {
    // בדיקה אם יש כבר טוסט פעיל
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // יצירת אלמנט הטוסט
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    // הוספה לעמוד
    document.body.appendChild(toast);
    
    // הצגה באנימציה
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // הסתרה לאחר משך הזמן שהוגדר
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}

/**
 * הצגת דיאלוג אישור מחיקה
 * @param {string} message - הודעת האישור
 * @param {Function} deleteCallback - פונקציה שתופעל אם המשתמש אישר
 * @param {boolean} isSettingsDelete - האם זה אישור מחיקה בעמוד ההגדרות
 */
export function showDeleteConfirmation(message, deleteCallback, isSettingsDelete = false) {
    const modal = document.getElementById('confirm-delete-modal');
    const messageEl = document.getElementById('confirm-delete-message');
    const cancelBtn = document.getElementById('confirm-delete-cancel');
    const confirmBtn = document.getElementById('confirm-delete-confirm');
    
    if (isSettingsDelete) {
        modal.classList.add('settings-delete-modal');
    } else {
        modal.classList.remove('settings-delete-modal');
    }
    
    messageEl.textContent = message;
    modal.classList.add('show');
    
    // מחיקת כל האירועים הקודמים
    const confirmClone = confirmBtn.cloneNode(true);
    const cancelClone = cancelBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(confirmClone, confirmBtn);
    cancelBtn.parentNode.replaceChild(cancelClone, cancelBtn);
    
    // הגדרת האירועים החדשים
    const handleCancel = () => {
        modal.classList.remove('show');
    };
    
    const handleConfirm = () => {
        modal.classList.remove('show');
        deleteCallback();
    };
    
    const closeDeleteConfirmation = () => {
        modal.classList.remove('show');
    };
    
    // הוספת מאזיני אירועים
    cancelClone.addEventListener('click', handleCancel);
    confirmClone.addEventListener('click', handleConfirm);
    
    // מאזין אירועים למקש אסקייפ
    const handleKeyPress = (e) => {
        if (e.key === 'Escape') {
            closeDeleteConfirmation();
            document.removeEventListener('keydown', handleKeyPress);
        }
    };
    document.addEventListener('keydown', handleKeyPress);
    
    // מאזין ללחיצה מחוץ למודאל
    const handleModalClick = (e) => {
        if (e.target === modal) {
            closeDeleteConfirmation();
            modal.removeEventListener('click', handleModalClick);
        }
    };
    modal.addEventListener('click', handleModalClick);
    
    // מחזירים את פונקציית הניקוי
    return closeDeleteConfirmation;
}

/**
 * ייצוא נתונים למכשיר
 * @returns {Promise<void>}
 */
export async function exportData() {
    // איסוף הנתונים מה-localStorage
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        try {
            data[key] = JSON.parse(localStorage.getItem(key));
        } catch (e) {
            data[key] = localStorage.getItem(key);
        }
    }
    
    const dataString = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataString], { type: 'application/json' });
    
    // בדיקה אם מדובר במכשיר מובייל עם Capacitor או Cordova
    const isMobile = typeof window.Capacitor !== 'undefined' || typeof cordova !== 'undefined';
    
    if (isMobile) {
        try {
            await requestStoragePermission();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `mytrip-backup-${timestamp}.json`;
            
            if (typeof cordova !== 'undefined' && cordova.file) {
                const targetDir = getDownloadsPath();
                
                if (!targetDir) {
                    throw new Error("לא נמצאה תיקיית הורדות זמינה");
                }
                
                // שימוש ב-File API של Cordova
                window.resolveLocalFileSystemURL(targetDir, function(dirEntry) {
                    // יצירת הקובץ
                    dirEntry.getFile(fileName, { create: true, exclusive: false }, function(fileEntry) {
                        // כתיבה לקובץ
                        fileEntry.createWriter(function(writer) {
                            writer.onwriteend = function() {
                                showToast(`הנתונים יוצאו בהצלחה לתיקיית ההורדות`, 'success', 3000);
                            };
                            
                            writer.onerror = function(err) {
                                console.error("שגיאה בכתיבה לקובץ:", err);
                                showToast("שגיאה בשמירת הקובץ", 'error');
                            };
                            
                            writer.write(dataBlob);
                        });
                    }, function(err) {
                        console.error("שגיאה ביצירת קובץ:", err);
                        fallbackToInternalStorage(fileName, dataBlob);
                    });
                }, function(err) {
                    console.error("שגיאה בגישה לתיקיית ההורדות:", err);
                    fallbackToInternalStorage(fileName, dataBlob);
                });
            } else {
                // שימוש בשיטת הדפדפן הרגילה
                const url = URL.createObjectURL(dataBlob);
                const a = document.createElement('a');
                a.download = fileName;
                a.href = url;
                a.click();
                
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                }, 100);
                
                showToast('הנתונים יוצאו בהצלחה!');
            }
        } catch (error) {
            console.error('שגיאה בייצוא נתונים:', error);
            showToast('אירעה שגיאה בייצוא הנתונים', 'error');
        }
    } else {
        // שיטה רגילה לדפדפן
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        a.download = `mytrip-backup-${timestamp}.json`;
        a.href = url;
        a.click();
        
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 100);
        
        showToast('הנתונים יוצאו בהצלחה!');
    }
}

/**
 * ייבוא נתונים מקובץ
 * @param {Event} event - אירוע שינוי הקובץ
 */
export function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // אישור מהמשתמש
            showDeleteConfirmation('פעולה זו תחליף את כל הנתונים הקיימים. האם להמשיך?', () => {
                // שמירת הנתונים ב-localStorage
                for (const key in data) {
                    if (typeof data[key] === 'object') {
                        localStorage.setItem(key, JSON.stringify(data[key]));
                    } else {
                        localStorage.setItem(key, data[key]);
                    }
                }
                
                showToast('הנתונים יובאו בהצלחה! מרענן את העמוד...');
                
                // רענון העמוד
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            });
        } catch (error) {
            console.error('שגיאה בייבוא נתונים:', error);
            showToast('שגיאה בייבוא הנתונים. אנא ודא שהקובץ תקין.', 'error');
        }
    };
    
    reader.readAsText(file);
    
    // איפוס שדה הקובץ
    event.target.value = '';
}

/**
 * איפוס כל נתוני האפליקציה
 */
export function resetApp() {
    showDeleteConfirmation('האם אתה בטוח שברצונך למחוק את כל הנתונים? פעולה זו אינה ניתנת לביטול!', () => {
        showDeleteConfirmation('אזהרה אחרונה: כל הנתונים יימחקו לצמיתות. האם להמשיך?', () => {
            // גיבוי שקט לפני מחיקה
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

/**
 * גיבוי שקט לפני איפוס
 */
function silentBackupBeforeReset() {
    try {
        // איסוף נתונים מה-localStorage
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
            return;
        }
        
        // יצירת גיבוי ב-localStorage
        try {
            const dataStr = JSON.stringify(data);
            localStorage.setItem('_lastBackupBeforeReset', dataStr);
        } catch (e) {
            console.error("שגיאה בשמירת גיבוי ב-localStorage:", e);
        }
    } catch (e) {
        console.error("שגיאה בביצוע גיבוי שקט:", e);
    }
}

/**
 * בקשת הרשאות גישה לאחסון במכשיר
 * @returns {Promise<void>}
 */
async function requestStoragePermission() {
    return new Promise((resolve) => {
        // אם יש ממשק הרשאות ב-Cordova
        if (typeof cordova !== 'undefined' && cordova.plugins && cordova.plugins.permissions) {
            const permissions = cordova.plugins.permissions;
            
            const requiredPermissions = [
                permissions.READ_EXTERNAL_STORAGE,
                permissions.WRITE_EXTERNAL_STORAGE
            ];
            
            const checkAndRequest = async () => {
                for (const permission of requiredPermissions) {
                    const hasPermission = await new Promise(resolve => {
                        permissions.checkPermission(permission, status => {
                            resolve(status.hasPermission);
                        }, () => resolve(false));
                    });
                    
                    if (!hasPermission) {
                        await new Promise(resolve => {
                            permissions.requestPermission(permission, status => {
                                resolve(status.hasPermission);
                            }, () => resolve(false));
                        });
                    }
                }
            };
            
            checkAndRequest()
                .then(() => resolve())
                .catch(() => resolve());
        } else {
            // אין צורך בהרשאות או אין אפשרות לבקש
            resolve();
        }
    });
}

/**
 * קבלת נתיב תיקיית ההורדות
 * @returns {string|null}
 */
function getDownloadsPath() {
    if (typeof cordova === 'undefined' || !cordova.file) {
        return null;
    }
    
    // אנדרואיד - ננסה את תיקיית ההורדות הציבורית
    if (cordova.file.externalRootDirectory) {
        return cordova.file.externalRootDirectory + "Download/";
    }
    
    // חלופות אחרות לפי סדר עדיפות
    if (cordova.file.externalDownloadsDirectory) {
        return cordova.file.externalDownloadsDirectory;
    }
    
    if (cordova.file.externalDataDirectory) {
        return cordova.file.externalDataDirectory;
    }
    
    return cordova.file.dataDirectory;
}

/**
 * נסיון לשמור בתיקייה פנימית אם נכשלנו באחסון חיצוני
 * @param {string} fileName - שם הקובץ
 * @param {Blob} dataBlob - הנתונים לשמירה
 */
function fallbackToInternalStorage(fileName, dataBlob) {
    if (typeof cordova === 'undefined' || !cordova.file) {
        showToast("לא ניתן למצוא אפשרות לשמירת הקובץ", 'error');
        return;
    }
    
    // שימוש בתיקייה פנימית
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dirEntry) {
        dirEntry.getFile(fileName, { create: true, exclusive: false }, function(fileEntry) {
            fileEntry.createWriter(function(writer) {
                writer.onwriteend = function() {
                    showToast(`הנתונים יוצאו בהצלחה`, 'success', 3000);
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

/**
 * אתחול מאזיני האירועים למודאל ההגדרות
 */
export function setupSettingsHandlers() {
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settings-modal');
    
    if (!settingsBtn || !settingsModal) return;
    
    // פתיחת מודאל ההגדרות
    settingsBtn.addEventListener('click', () => {
        openModal('settings-modal');
    });
    
    // סגירת מודאל ההגדרות
    const closeBtn = settingsModal.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeAllModals);
    }
    
    // סגירה בלחיצה מחוץ למודאל
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            closeAllModals();
        }
    });
    
    // כפתורי ייצוא וייבוא
    const exportDataBtn = document.getElementById('exportDataBtn');
    const importDataBtn = document.getElementById('importDataBtn');
    const importFileInput = document.getElementById('importFileInput');
    const resetAppBtn = document.getElementById('resetAppBtn');
    
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', exportData);
    }
    
    if (importDataBtn && importFileInput) {
        importDataBtn.addEventListener('click', () => {
            importFileInput.click();
        });
        importFileInput.addEventListener('change', importData);
    }
    
    if (resetAppBtn) {
        resetAppBtn.addEventListener('click', resetApp);
    }
} 