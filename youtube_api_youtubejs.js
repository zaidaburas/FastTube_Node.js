/**
 * YouTube Downloader API - باستخدام YouTube.js (InnerTube API)
 * الحل الأكثر موثوقية وأماناً لتحميل فيديوهات YouTube
 * 
 * المميزات:
 * - يستخدم نفس API الرسمي من YouTube (InnerTube)
 * - لا يتم كشفه كبوت
 * - يدعم جميع أنواع الفيديوهات
 * - يعمل في Production بدون مشاكل
 */

const express = require('express');
const cors = require('cors');
const { Innertube } = require('youtubei.js');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// تهيئة YouTube.js client عند بدء التشغيل
let youtube;

async function initYouTube() {
    try {
        youtube = await Innertube.create({
            cookie: 'cookies.txt',
            cache: false   // أوقف الكاش بالكامل
            });

        console.log('✅ YouTube.js initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize YouTube.js:', error);
        throw error;
    }
}

// ==================== ENDPOINTS ====================

/**
 * GET /api/info
 * الحصول على معلومات الفيديو
 */
app.get('/api/info', async (req, res) => {
    try {
        const videoUrl = req.query.url;
        
        if (!videoUrl) {
            return res.status(400).json({ 
                error: 'Missing video URL',
                message: 'Please provide a video URL in the query parameter: ?url=VIDEO_URL'
            });
        }

        console.log(`📥 Fetching info for: ${videoUrl}`);

        // استخراج معلومات الفيديو
        const info = await youtube.getInfo(extractVideoId(videoUrl));

        // تنسيق البيانات
        const videoData = {
            success: true,
            video_id: info.basic_info.id,
            title: info.basic_info.title,
            author: info.basic_info.author,
            channel_id: info.basic_info.channel_id,
            duration: info.basic_info.duration,
            view_count: info.basic_info.view_count,
            like_count: info.basic_info.like_count,
            is_live: info.basic_info.is_live,
            is_upcoming: info.basic_info.is_upcoming,
            is_post_live_dvr: info.basic_info.is_post_live_dvr,
            thumbnail: info.basic_info.thumbnail?.[0]?.url || null,
            description: info.basic_info.short_description || '',
            upload_date: info.basic_info.publish_date || null,
            
            // معلومات الـ formats المتاحة
            formats: {
                video_and_audio: info.streaming_data?.formats?.map(format => ({
                    itag: format.itag,
                    quality: format.quality_label,
                    mime_type: format.mime_type,
                    bitrate: format.bitrate,
                    width: format.width,
                    height: format.height,
                    fps: format.fps,
                    has_audio: format.has_audio,
                    has_video: format.has_video,
                    file_size: format.content_length
                })) || [],
                
                video_only: info.streaming_data?.adaptive_formats
                    ?.filter(f => f.has_video && !f.has_audio)
                    ?.map(format => ({
                        itag: format.itag,
                        quality: format.quality_label,
                        mime_type: format.mime_type,
                        bitrate: format.bitrate,
                        width: format.width,
                        height: format.height,
                        fps: format.fps,
                        file_size: format.content_length
                    })) || [],
                
                audio_only: info.streaming_data?.adaptive_formats
                    ?.filter(f => f.has_audio && !f.has_video)
                    ?.map(format => ({
                        itag: format.itag,
                        mime_type: format.mime_type,
                        bitrate: format.bitrate,
                        audio_channels: format.audio_channels,
                        audio_sample_rate: format.audio_sample_rate,
                        file_size: format.content_length
                    })) || []
            }
        };

        console.log(`✅ Successfully fetched info for: ${videoData.title}`);
        res.json(videoData);

    } catch (error) {
        console.error('❌ Error fetching video info:', error);
        res.status(500).json({ 
            error: 'Failed to fetch video info',
            message: error.message,
            details: error.stack
        });
    }
});

/**
 * GET /api/download
 * تحميل الفيديو
 */
app.get('/api/download', async (req, res) => {
    try {
        const videoUrl = req.query.url;
        const quality = req.query.quality || 'highest'; // highest, high, medium, low
        const format = req.query.format || 'mp4'; // mp4, webm
        
        if (!videoUrl) {
            return res.status(400).json({ 
                error: 'Missing video URL',
                message: 'Please provide a video URL in the query parameter: ?url=VIDEO_URL'
            });
        }

        console.log(`📥 Downloading: ${videoUrl} (Quality: ${quality})`);

        const info = await youtube.getInfo(extractVideoId(videoUrl));
        
        // اختيار أفضل format
        let selectedFormat;
        const formats = info.streaming_data?.formats || [];
        
        if (quality === 'highest') {
            selectedFormat = formats[0]; // أعلى جودة
        } else if (quality === 'high') {
            selectedFormat = formats.find(f => f.quality_label === '720p') || formats[0];
        } else if (quality === 'medium') {
            selectedFormat = formats.find(f => f.quality_label === '480p') || formats[1];
        } else {
            selectedFormat = formats[formats.length - 1]; // أقل جودة
        }

        if (!selectedFormat) {
            return res.status(404).json({ 
                error: 'No suitable format found',
                message: 'Could not find a video format matching your requirements'
            });
        }

        // تحميل الفيديو
        const stream = await youtube.download(info.basic_info.id, {
            type: 'video+audio', // أو 'video' أو 'audio'
            quality: quality,
            format: format
        });

        // إعداد الـ response headers
        const filename = `${sanitizeFilename(info.basic_info.title)}.${format}`;
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', selectedFormat.mime_type || 'video/mp4');
        
        if (selectedFormat.content_length) {
            res.setHeader('Content-Length', selectedFormat.content_length);
        }

        // Stream الفيديو مباشرة للمستخدم
        console.log(`📤 Streaming video: ${filename}`);
        
        for await (const chunk of stream) {
            res.write(chunk);
        }
        
        res.end();
        console.log(`✅ Download completed: ${filename}`);

    } catch (error) {
        console.error('❌ Error downloading video:', error);
        if (!res.headersSent) {
            res.status(500).json({ 
                error: 'Failed to download video',
                message: error.message,
                details: error.stack
            });
        }
    }
});

/**
 * GET /api/audio
 * تحميل الصوت فقط
 */
app.get('/api/audio', async (req, res) => {
    try {
        const videoUrl = req.query.url;
        const quality = req.query.quality || 'high'; // high, medium, low
        
        if (!videoUrl) {
            return res.status(400).json({ 
                error: 'Missing video URL',
                message: 'Please provide a video URL'
            });
        }

        console.log(`🎵 Downloading audio from: ${videoUrl}`);

        const info = await youtube.getInfo(extractVideoId(videoUrl));
        
        // تحميل الصوت فقط
        const stream = await youtube.download(info.basic_info.id, {
            type: 'audio',
            quality: quality,
            format: 'mp4' // سيتم تحويله لـ m4a
        });

        const filename = `${sanitizeFilename(info.basic_info.title)}.m4a`;
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'audio/mp4');

        console.log(`📤 Streaming audio: ${filename}`);
        
        for await (const chunk of stream) {
            res.write(chunk);
        }
        
        res.end();
        console.log(`✅ Audio download completed: ${filename}`);

    } catch (error) {
        console.error('❌ Error downloading audio:', error);
        if (!res.headersSent) {
            res.status(500).json({ 
                error: 'Failed to download audio',
                message: error.message
            });
        }
    }
});

/**
 * GET /api/search
 * البحث عن فيديوهات
 */
app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q;
        const limit = parseInt(req.query.limit) || 10;
        
        if (!query) {
            return res.status(400).json({ 
                error: 'Missing search query',
                message: 'Please provide a search query: ?q=YOUR_QUERY'
            });
        }

        console.log(`🔍 Searching for: ${query}`);

        const results = await youtube.search(query, {
            type: 'video'
        });

        const videos = results.videos.slice(0, limit).map(video => ({
            video_id: video.id,
            title: video.title.text,
            author: video.author?.name,
            channel_id: video.author?.id,
            duration: video.duration?.text,
            view_count: video.view_count?.text,
            published: video.published?.text,
            thumbnail: video.thumbnails?.[0]?.url,
            description: video.description
        }));

        res.json({
            success: true,
            query: query,
            result_count: videos.length,
            videos: videos
        });

        console.log(`✅ Found ${videos.length} results`);

    } catch (error) {
        console.error('❌ Error searching:', error);
        res.status(500).json({ 
            error: 'Search failed',
            message: error.message
        });
    }
});

/**
 * GET /health
 * التحقق من صحة الـ API
 */
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK',
        message: 'YouTube Downloader API is running',
        youtube_client: youtube ? 'Connected' : 'Not initialized',
        timestamp: new Date().toISOString()
    });
});

// ==================== HELPER FUNCTIONS ====================

/**
 * استخراج video ID من الرابط
 */
function extractVideoId(url) {
    // يدعم جميع صيغ روابط YouTube
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /^([a-zA-Z0-9_-]{11})$/ // إذا كان ID مباشر
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    
    throw new Error('Invalid YouTube URL');
}

/**
 * تنظيف اسم الملف من الأحرف الممنوعة
 */
function sanitizeFilename(filename) {
    return filename
        .replace(/[<>:"/\\|?*]/g, '') // إزالة الأحرف الممنوعة
        .replace(/\s+/g, '_') // استبدال المسافات بـ underscore
        .substring(0, 200); // تحديد الطول
}

// ==================== START SERVER ====================

async function startServer() {
    try {
        // تهيئة YouTube client أولاً
        await initYouTube();
        
        // بدء السيرفر
        app.listen(PORT, '0.0.0.0', () => {
            console.log('='.repeat(50));
            console.log(`🚀 YouTube Downloader API (YouTube.js)`);
            console.log(`📡 Server running on port ${PORT}`);
            console.log(`🌐 Base URL: http://localhost:${PORT}`);
            console.log('='.repeat(50));
            console.log('\n📋 Available Endpoints:');
            console.log(`   GET  /api/info?url=VIDEO_URL`);
            console.log(`   GET  /api/download?url=VIDEO_URL&quality=highest`);
            console.log(`   GET  /api/audio?url=VIDEO_URL`);
            console.log(`   GET  /api/search?q=QUERY`);
            console.log(`   GET  /health`);
            console.log('\n' + '='.repeat(50) + '\n');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// معالجة الأخطاء غير المتوقعة
process.on('unhandledRejection', (error) => {
    console.error('❌ Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

// بدء السيرفر
startServer();
