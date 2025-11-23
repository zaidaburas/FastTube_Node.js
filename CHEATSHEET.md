# 📋 Cheat Sheet - مرجع سريع

## ⚡ الأوامر الأساسية

### Node.js (YouTube.js)
```bash
# التثبيت
npm install

# التشغيل
node youtube_api_youtubejs.js

# التحديث
npm update youtubei.js
```

### Python (InnerTube)
```bash
# التثبيت
pip install flask flask-cors requests

# التشغيل
python youtube_api_alternative_python.py

# التحديث
pip install --upgrade flask requests
```

---

## 🔌 الـ API Endpoints

### 1. معلومات الفيديو
```bash
GET /api/info?url=VIDEO_URL
```

**مثال:**
```bash
curl "http://localhost:3000/api/info?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

**Response:**
```json
{
  "success": true,
  "video_id": "...",
  "title": "...",
  "author": "...",
  "duration": 123,
  "view_count": "...",
  "formats": {...}
}
```

### 2. تحميل الفيديو
```bash
GET /api/download?url=VIDEO_URL&quality=QUALITY&format=FORMAT
```

**Parameters:**
- `quality`: `highest`, `high`, `medium`, `low`
- `format`: `mp4`, `webm`

**مثال:**
```bash
# في المتصفح
http://localhost:3000/api/download?url=VIDEO_URL&quality=high
```

### 3. تحميل الصوت
```bash
GET /api/audio?url=VIDEO_URL&quality=QUALITY
```

**Parameters:**
- `quality`: `high`, `medium`, `low`

**مثال:**
```bash
http://localhost:3000/api/audio?url=VIDEO_URL
```

### 4. البحث
```bash
GET /api/search?q=QUERY&limit=NUMBER
```

**Parameters:**
- `q`: نص البحث
- `limit`: عدد النتائج (default: 10)

**مثال:**
```bash
curl "http://localhost:3000/api/search?q=python+tutorial&limit=5"
```

### 5. Health Check
```bash
GET /health
```

**مثال:**
```bash
curl "http://localhost:3000/health"
```

---

## 💻 أمثلة الكود

### JavaScript (Vanilla)
```javascript
// الحصول على معلومات
const response = await fetch(`http://localhost:3000/api/info?url=${encodeURIComponent(url)}`);
const data = await response.json();

// تحميل
window.open(`http://localhost:3000/api/download?url=${encodeURIComponent(url)}`, '_blank');
```

### React
```jsx
const [info, setInfo] = useState(null);

const getInfo = async (url) => {
  const res = await fetch(`/api/info?url=${encodeURIComponent(url)}`);
  const data = await res.json();
  setInfo(data);
};
```

### Vue
```vue
<script setup>
import { ref } from 'vue';

const info = ref(null);

const getInfo = async (url) => {
  const res = await fetch(`/api/info?url=${encodeURIComponent(url)}`);
  info.value = await res.json();
};
</script>
```

### Python (Requests)
```python
import requests

response = requests.get('http://localhost:3000/api/info', 
                       params={'url': 'VIDEO_URL'})
data = response.json()
```

### cURL
```bash
# GET request
curl "http://localhost:3000/api/info?url=VIDEO_URL"

# مع headers
curl -H "Content-Type: application/json" \
     "http://localhost:3000/api/info?url=VIDEO_URL"

# حفظ النتيجة
curl "http://localhost:3000/api/info?url=VIDEO_URL" > info.json
```

---

## 🚀 إعدادات Render.com

### Node.js
```yaml
Environment: Node
Node Version: 18.17.0
Build Command: npm install
Start Command: node youtube_api_youtubejs.js
```

### Python
```yaml
Environment: Python 3
Python Version: 3.10
Build Command: pip install -r requirements_alternative.txt
Start Command: python youtube_api_alternative_python.py
```

### Environment Variables
```
PORT=10000
NODE_ENV=production
```

---

## 🔧 حل المشاكل

### خطأ: "bot detection"
```bash
# الحل: استخدم YouTube.js
npm install youtubei.js
node youtube_api_youtubejs.js
```

### خطأ: "port in use"
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

### خطأ: "module not found"
```bash
# Node.js
npm install

# Python
pip install -r requirements_alternative.txt
```

### خطأ: "timeout"
```javascript
// زيادة الـ timeout
const response = await fetch(url, { 
  timeout: 30000  // 30 seconds
});
```

---

## 📊 Formats & Quality

### Video Qualities
```
highest  → أعلى جودة متاحة (قد تكون 4K)
high     → 720p
medium   → 480p
low      → 360p أو أقل
```

### Audio Qualities
```
high     → 128kbps أو أعلى
medium   → 64-96kbps
low      → 48kbps أو أقل
```

### File Formats
```
mp4      → H.264 video + AAC audio (الأكثر توافقاً)
webm     → VP9 video + Opus audio (جودة أفضل، حجم أصغر)
m4a      → AAC audio only
```

---

## 🎨 Status Codes

```
200 → Success
400 → Bad Request (URL مفقود أو خطأ)
404 → Not Found (الفيديو غير موجود)
500 → Server Error (خطأ في السيرفر)
```

---

## 🔐 إضافة Cookies

### YouTube.js
```javascript
youtube = await Innertube.create({
    cookie: 'YOUR_COOKIE_STRING',
    cache: { enabled: true }
});
```

### كيفية الحصول على Cookies
1. تثبيت [EditThisCookie](http://www.editthiscookie.com/)
2. فتح YouTube وتسجيل الدخول
3. الضغط على Extension → Export
4. نسخ الـ JSON

---

## 📱 CORS Settings

### إذا كنت تستخدم من Frontend

```javascript
// في youtube_api_youtubejs.js
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:3001', 'https://your-frontend.com'],
  methods: ['GET', 'POST'],
  credentials: true
}));
```

---

## ⚙️ Performance Tips

### 1. تفعيل Caching
```javascript
youtube = await Innertube.create({
    cache: {
        enabled: true,
        ttl: 3600  // 1 hour
    }
});
```

### 2. تحديد عدد الطلبات
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100  // max 100 requests per window
});

app.use('/api/', limiter);
```

### 3. Compression
```javascript
const compression = require('compression');
app.use(compression());
```

---

## 🧪 اختبارات سريعة

### Test 1: Health Check
```bash
curl http://localhost:3000/health
```

### Test 2: Video Info
```bash
curl "http://localhost:3000/api/info?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

### Test 3: Search
```bash
curl "http://localhost:3000/api/search?q=test&limit=3"
```

### Test 4: Download
```bash
# في المتصفح
http://localhost:3000/api/download?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

---

## 📝 Git Commands

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin YOUR_REPO_URL
git branch -M main
git push -u origin main

# Update
git add .
git commit -m "Update message"
git push
```

---

## 🔄 Update Commands

### Node.js
```bash
# تحديث YouTube.js
npm update youtubei.js

# تحديث جميع المكتبات
npm update

# تحقق من التحديثات
npm outdated
```

### Python
```bash
# تحديث مكتبة واحدة
pip install --upgrade flask

# تحديث الكل
pip install --upgrade -r requirements_alternative.txt

# تحقق من التحديثات
pip list --outdated
```

---

## 💡 نصائح سريعة

### 1. استخدام Environment Variables
```javascript
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
```

### 2. Logging
```javascript
console.log(`📥 Request: ${req.method} ${req.url}`);
console.log(`✅ Success: ${videoInfo.title}`);
console.log(`❌ Error: ${error.message}`);
```

### 3. Error Handling
```javascript
try {
  // code
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ error: error.message });
}
```

---

## 📚 روابط مفيدة

### YouTube.js
- Docs: https://ytjs.dev/
- GitHub: https://github.com/LuanRT/YouTube.js
- Discord: https://discord.gg/syDu7Yks54

### Render.com
- Dashboard: https://dashboard.render.com/
- Docs: https://render.com/docs

### Node.js
- Download: https://nodejs.org/
- Docs: https://nodejs.org/docs/

---

## ✅ Checklist النشر

- [ ] الكود يعمل محلياً
- [ ] تم الاختبار على جميع الـ endpoints
- [ ] تم Push للـ GitHub
- [ ] تم ربط Render
- [ ] Environment variables محددة
- [ ] الـ build نجح
- [ ] الـ deploy نجح
- [ ] تم الاختبار على Production

---

**احفظ هذا الملف للرجوع إليه دائماً! 📌**
