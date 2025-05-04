/**
 * פונקציות עזר לעבודה עם זמנים
 */

/**
 * חישוב זמן סיום בהתבסס על זמן התחלה ומשך
 * @param {string} startTime - זמן התחלה בפורמט HH:MM
 * @param {number} duration - משך בדקות
 * @returns {string} - זמן סיום בפורמט HH:MM
 */
export function calculateEndTime(startTime, duration) {
    const [hours, minutes] = startTime.split(':').map(Number);
    let totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
}

/**
 * פורמט של זמן בפורמט שעה:דקות
 * @param {string} time - זמן בפורמט HH:MM
 * @returns {string} - זמן מפורמט
 */
export function formatTime(time) {
    return time;
}

/**
 * פורמט של משך זמן בדקות לתצוגה ידידותית
 * @param {number} minutes - משך בדקות
 * @returns {string} - טקסט מפורמט של משך הזמן
 */
export function formatDuration(minutes) {
    if (minutes < 60) {
        return `${minutes} דקות`;
    } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        
        if (remainingMinutes === 0) {
            return hours === 1 ? 'שעה' : `${hours} שעות`;
        } else {
            return hours === 1 
                ? `שעה ו-${remainingMinutes} דקות` 
                : `${hours} שעות ו-${remainingMinutes} דקות`;
        }
    }
} 