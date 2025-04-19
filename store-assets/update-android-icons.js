/**
 * סקריפט להעתקת האייקונים החדשים לתיקיות המיפמאפ של אנדרואיד
 */

const fs = require('fs');
const path = require('path');

// מיפוי בין קבצי האייקון לתיקיות המיפמאפ
const iconMappings = [
  { source: 'icon-xxxhdpi.png', destination: '../android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png' },
  { source: 'icon-xxhdpi.png', destination: '../android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png' },
  { source: 'icon-xhdpi.png', destination: '../android/app/src/main/res/mipmap-xhdpi/ic_launcher.png' },
  { source: 'icon-hdpi.png', destination: '../android/app/src/main/res/mipmap-hdpi/ic_launcher.png' },
  { source: 'icon-mdpi.png', destination: '../android/app/src/main/res/mipmap-mdpi/ic_launcher.png' },
  // עותקים עבור האייקונים העגולים
  { source: 'icon-xxxhdpi.png', destination: '../android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png' },
  { source: 'icon-xxhdpi.png', destination: '../android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png' },
  { source: 'icon-xhdpi.png', destination: '../android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png' },
  { source: 'icon-hdpi.png', destination: '../android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png' },
  { source: 'icon-mdpi.png', destination: '../android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png' },
  // עותק לתיקיית הנכסים של החנות
  { source: 'icon-512x512.png', destination: 'play-store-icon.png' }
];

function updateAndroidIcons() {
  try {
    console.log('מעדכן אייקונים באנדרואיד...');
    
    // בדיקה שכל קבצי המקור קיימים
    for (const { source } of iconMappings) {
      const sourcePath = path.join(__dirname, source);
      if (!fs.existsSync(sourcePath)) {
        console.error(`קובץ המקור לא נמצא: ${sourcePath}`);
        console.error('הרץ קודם את הסקריפט convert-svg-to-png.js');
        return;
      }
    }
    
    // העתקת כל הקבצים ליעדים שלהם
    for (const { source, destination } of iconMappings) {
      const sourcePath = path.join(__dirname, source);
      const destPath = path.join(__dirname, destination);
      
      // יצירת תיקיית היעד אם אינה קיימת
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      // העתקת הקובץ
      fs.copyFileSync(sourcePath, destPath);
      console.log(`הועתק: ${source} אל ${destination}`);
    }
    
    console.log('כל האייקונים הועתקו בהצלחה!');
    console.log('האייקון לחנות גוגל פליי נשמר בנתיב:', path.join(__dirname, 'play-store-icon.png'));
    
  } catch (error) {
    console.error('שגיאה בעדכון האייקונים:', error.message);
  }
}

// הפעלת הפונקציה
updateAndroidIcons(); 