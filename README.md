# 🛡️ VT Shield v4.0

ממשק PWA מתקדם לסריקת קבצים דרך [VirusTotal API v3](https://docs.virustotal.com/reference/overview) עם 70+ מנועי אנטי-וירוס.

## קבצים

| קובץ | תפקיד |
|------|--------|
| `index.html` | האפליקציה המלאה (HTML + CSS + JS) |
| `manifest.json` | הגדרות PWA (ניתן להתקנה כאפליקציה) |
| `sw.js` | Service Worker (עבודה אופליין + שיתוף קבצים) |

## הפעלה

```bash
# שרת מקומי מהיר (Python)
python3 -m http.server 8080

# שרת מקומי (Node)
npx serve .
```
פתח: `http://localhost:8080`

## מפתח API

1. הירשם בחינם: https://www.virustotal.com/gui/join-us
2. קבל מפתח: https://www.virustotal.com/gui/my-apikey
3. הדבק בהגדרות האפליקציה

## תכונות

- **כל סוגי הקבצים** — PDF, EXE, APK, Office, ZIP, Image, Audio, Video, Code ועוד
- **קבצים גדולים** — עד 32MB (חינם) / עד 650MB (פרמיום) דרך upload_url
- **גרור ושחרר** — drag & drop על אזור ההעלאה  
- **ביטול סריקה** — ביטול מיידי דרך AbortController
- **העתק SHA-256** — בלחיצה אחת
- **קישור לVT** — פתח תוצאה ישירות ב-VirusTotal
- **PWA** — ניתן להתקנה כאפליקציה נייטיב
- **מצב כהה/בהיר** — מתחלף עם שמירה
- **היסטוריה** — שמורה ב-localStorage עם חיפוש וסינון
- **התראות דפדפן** — על תוצאת כל סריקה
- **Retry אוטומטי** — על שגיאות 429 (rate limit) ושגיאות רשת

## מגבלות API חינמי

| מגבלה | ערך |
|--------|-----|
| בקשות לדקה | 4 |
| בקשות ביום | 500 |
| גודל קובץ | 32 MB |

## טכנולוגיות

- Vanilla JS (ללא תלויות)
- VirusTotal API v3
- Web Notifications API
- Clipboard API
- AbortController
- Service Worker / PWA
- localStorage
