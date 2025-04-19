/**
 * סקריפט להמרת קובץ SVG לקובץ PNG
 * התקנה הנדרשת:
 * npm install sharp svgexport
 */

const { execSync } = require('child_process');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// הגדרת נתיבים
const svgPath = path.join(__dirname, 'app-icon.svg');
const tempPngPath = path.join(__dirname, 'temp-icon.png');
const outputSizes = [
  { size: 512, name: 'icon-512x512.png' },  // גוגל פליי
  { size: 1024, name: 'icon-1024x1024.png' }, // אפל אפ סטור
  { size: 192, name: 'icon-xxxhdpi.png' },
  { size: 144, name: 'icon-xxhdpi.png' },
  { size: 96, name: 'icon-xhdpi.png' },
  { size: 72, name: 'icon-hdpi.png' },
  { size: 48, name: 'icon-mdpi.png' },
];

async function convertSvgToPng() {
  try {
    if (!fs.existsSync(svgPath)) {
      console.error('קובץ ה-SVG לא נמצא:', svgPath);
      return;
    }

    console.log('ממיר SVG ל-PNG...');
    
    // המרה ראשונית ל-PNG בגודל גדול
    execSync(`npx svgexport ${svgPath} ${tempPngPath} 1024:1024`);
    
    // יצירת גרסאות בגדלים שונים
    for (const { size, name } of outputSizes) {
      const outputPath = path.join(__dirname, name);
      
      await sharp(tempPngPath)
        .resize(size, size)
        .png({ quality: 100 })
        .toFile(outputPath);
        
      console.log(`נוצר: ${name} בגודל ${size}x${size} פיקסלים`);
    }
    
    // מחיקת קובץ זמני
    fs.unlinkSync(tempPngPath);
    
    console.log('ההמרה הושלמה בהצלחה!');
    console.log('הקבצים נשמרו בתיקייה:', __dirname);
    
  } catch (error) {
    console.error('שגיאה בהמרת הקובץ:', error.message);
  }
}

// הפעלת הפונקציה
convertSvgToPng(); 