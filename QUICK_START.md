# ⚡ دليل البدء السريع (5 دقائق)

## 🎯 الهدف
تشغيل YouTube Downloader API محلياً في أقل من 5 دقائق.

---

## 🚀 الطريقة الموصى بها (YouTube.js)

### الخطوة 1️⃣: التحقق من المتطلبات (30 ثانية)

```bash
# تحقق من Node.js (يجب أن يكون >= 18)
node --version

# إذا لم يكن مثبتاً، حمّله من:
# https://nodejs.org/
```

### الخطوة 2️⃣: التثبيت (1 دقيقة)

```bash
# في مجلد المشروع
npm install
```

### الخطوة 3️⃣: التشغيل (5 ثواني)

```bash
node youtube_api_youtubejs.js
```

### الخطوة 4️⃣: الاختبار (1 دقيقة)

**في Terminal آخر:**
```bash
curl "http://localhost:3000/api/info?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

**أو في المتصفح:**
```
http://localhost:3000/api/download?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

**النتيجة المتوقعة:**
- ✅ يجب أن ترى JSON كامل مع معلومات الفيديو
- ✅ التحميل يجب أن يبدأ فوراً
- ✅ لا توجد رسالة "bot detection"

---

## 🐍 الطريقة البديلة (Python)

### الخطوة 1️⃣: التحقق من Python

```bash
python --version  # يجب أن يكون >= 3.8
```

### الخطوة 2️⃣: التثبيت

```bash
pip install flask flask-cors requests
```

### الخطوة 3️⃣: التشغيل

```bash
python youtube_api_alternative_python.py
```

### الخطوة 4️⃣: الاختبار

نفس الاختبارات أعلاه ☝️

---

## 🌐 النشر على Render (3 دقائق)

### الخطوة 1️⃣: Push للـ GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### الخطوة 2️⃣: ربط Render بـ GitHub

1. اذهب إلى https://render.com/
2. اضغط "New" → "Web Service"
3. اربط GitHub repository
4. اختر المشروع

### الخطوة 3️⃣: الإعدادات

**للـ YouTube.js:**
```
Environment: Node
Build Command: npm install
Start Command: node youtube_api_youtubejs.js
```

**للـ Python:**
```
Environment: Python 3
Build Command: pip install -r requirements_alternative.txt
Start Command: python youtube_api_alternative_python.py
```

### الخطوة 4️⃣: Deploy

اضغط "Create Web Service" وانتظر 2-3 دقائق.

### الخطوة 5️⃣: الاختبار

```bash
curl "https://your-app.onrender.com/health"
```

---

## ✅ تم! 🎉

الآن لديك API جاهز للاستخدام!

### الخطوات التالية:

1. **اقرأ التوثيق الكامل**: `README_FINAL.md`
2. **اختبر جميع الـ endpoints**: `TEST_ALL_SOLUTIONS.md`
3. **قارن الحلول**: `COMPARISON.md`
4. **استخدم من Frontend**: انظر الأمثلة أدناه

---

## 💻 أمثلة استخدام من Frontend

### JavaScript (Fetch API)

```javascript
// الحصول على معلومات الفيديو
async function getVideoInfo(url) {
    const response = await fetch(`http://localhost:3000/api/info?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    return data;
}

// استخدام
const info = await getVideoInfo('https://www.youtube.com/watch?v=VIDEO_ID');
console.log(info.title);
console.log(info.formats);
```

### React Example

```jsx
import { useState } from 'react';

function VideoDownloader() {
    const [url, setUrl] = useState('');
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const handleGetInfo = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/info?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            setInfo(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div>
            <input 
                type="text" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)}
                placeholder="YouTube URL"
            />
            <button onClick={handleGetInfo} disabled={loading}>
                {loading ? 'Loading...' : 'Get Info'}
            </button>
            
            {info && (
                <div>
                    <h2>{info.title}</h2>
                    <p>By: {info.author}</p>
                    <a href={`/api/download?url=${encodeURIComponent(url)}`} download>
                        Download Video
                    </a>
                </div>
            )}
        </div>
    );
}
```

### Vue.js Example

```vue
<template>
  <div>
    <input v-model="url" placeholder="YouTube URL" />
    <button @click="getInfo" :disabled="loading">
      {{ loading ? 'Loading...' : 'Get Info' }}
    </button>
    
    <div v-if="info">
      <h2>{{ info.title }}</h2>
      <p>By: {{ info.author }}</p>
      <a :href="`/api/download?url=${encodeURIComponent(url)}`" download>
        Download Video
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: '',
      info: null,
      loading: false
    };
  },
  methods: {
    async getInfo() {
      this.loading = true;
      try {
        const response = await fetch(`/api/info?url=${encodeURIComponent(this.url)}`);
        this.info = await response.json();
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
```

---

## 🎨 واجهة HTML بسيطة

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>YouTube Downloader</title>
    <style>
        * { font-family: Arial, sans-serif; }
        body { max-width: 800px; margin: 50px auto; padding: 20px; }
        input { width: 100%; padding: 10px; font-size: 16px; }
        button { padding: 10px 20px; font-size: 16px; margin: 10px 5px; cursor: pointer; }
        .info { background: #f0f0f0; padding: 20px; margin-top: 20px; border-radius: 5px; }
        .loading { color: #666; }
        .error { color: red; }
    </style>
</head>
<body>
    <h1>🎬 YouTube Video Downloader</h1>
    
    <input type="text" id="url" placeholder="الصق رابط الفيديو هنا" />
    
    <button onclick="getInfo()">📋 الحصول على المعلومات</button>
    <button onclick="download()">⬇️ تحميل الفيديو</button>
    
    <div id="result"></div>
    
    <script>
        const API_URL = 'http://localhost:3000'; // غيّره للـ production URL
        
        async function getInfo() {
            const url = document.getElementById('url').value;
            const result = document.getElementById('result');
            
            if (!url) {
                result.innerHTML = '<p class="error">من فضلك أدخل رابط الفيديو</p>';
                return;
            }
            
            result.innerHTML = '<p class="loading">جاري التحميل...</p>';
            
            try {
                const response = await fetch(`${API_URL}/api/info?url=${encodeURIComponent(url)}`);
                const data = await response.json();
                
                if (data.success) {
                    result.innerHTML = `
                        <div class="info">
                            <h2>${data.title}</h2>
                            <p><strong>القناة:</strong> ${data.author}</p>
                            <p><strong>المدة:</strong> ${formatDuration(data.duration)}</p>
                            <p><strong>المشاهدات:</strong> ${data.view_count}</p>
                            <img src="${data.thumbnail}" alt="Thumbnail" style="max-width: 100%;">
                        </div>
                    `;
                } else {
                    result.innerHTML = `<p class="error">خطأ: ${data.message}</p>`;
                }
            } catch (error) {
                result.innerHTML = `<p class="error">حدث خطأ: ${error.message}</p>`;
            }
        }
        
        function download() {
            const url = document.getElementById('url').value;
            if (!url) {
                alert('من فضلك أدخل رابط الفيديو');
                return;
            }
            window.open(`${API_URL}/api/download?url=${encodeURIComponent(url)}&quality=high`, '_blank');
        }
        
        function formatDuration(seconds) {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = seconds % 60;
            return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` 
                         : `${m}:${s.toString().padStart(2, '0')}`;
        }
    </script>
</body>
</html>
```

احفظ هذا في `index.html` وافتحه في المتصفح!

---

## 📱 استخدام من تطبيق موبايل

### React Native

```javascript
import axios from 'axios';

const API_URL = 'https://your-app.onrender.com';

export const getVideoInfo = async (url) => {
  try {
    const response = await axios.get(`${API_URL}/api/info`, {
      params: { url }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const downloadVideo = (url, quality = 'high') => {
  const downloadUrl = `${API_URL}/api/download?url=${encodeURIComponent(url)}&quality=${quality}`;
  // استخدم FileSystem.downloadAsync أو مكتبة مشابهة
  return downloadUrl;
};
```

---

## 🎉 مبروك!

الآن لديك:
- ✅ API يعمل محلياً
- ✅ API منشور على Render
- ✅ أمثلة جاهزة للاستخدام
- ✅ واجهة HTML بسيطة

### الخطوات التالية:

1. **طوّر Frontend خاص بك** - استخدم React/Vue/Angular
2. **أضف ميزات** - مثل playlists, channels, subtitles
3. **حسّن الأداء** - أضف caching و rate limiting
4. **شارك المشروع** - مع أصدقائك!

---

**هل تريد المزيد من التفاصيل؟**
- 📘 اقرأ `README_FINAL.md` للدليل الكامل
- 📊 اقرأ `COMPARISON.md` للمقارنة بين الحلول
- 🧪 اقرأ `TEST_ALL_SOLUTIONS.md` لاختبارات شاملة

**بالتوفيق! 🚀**
