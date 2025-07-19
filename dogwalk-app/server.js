const express = require('express');
const multer = require('multer');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3001;

// Security and performance middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors({
  origin: true, // Allow all origins for now
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Database setup
const db = new sqlite3.Database('dogwalk.db');

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS videos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    username TEXT NOT NULL,
    filename TEXT NOT NULL,
    thumbnail TEXT,
    duration INTEGER,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    uploadDate DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    videoId TEXT,
    username TEXT,
    UNIQUE(videoId, username)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    bio TEXT,
    location TEXT,
    profileImage TEXT,
    joinDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    followers INTEGER DEFAULT 0,
    following INTEGER DEFAULT 0,
    totalLikes INTEGER DEFAULT 0,
    totalViews INTEGER DEFAULT 0,
    totalShares INTEGER DEFAULT 0,
    totalComments INTEGER DEFAULT 0
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS user_achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    achievementId INTEGER,
    earnedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(username, achievementId)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    description TEXT NOT NULL,
    requirement TEXT NOT NULL
  )`);

  // Insert default achievements
  db.run(`INSERT OR IGNORE INTO achievements (id, name, icon, description, requirement) VALUES 
    (1, 'First Upload', '🎬', 'Uploaded your first video', 'upload_first_video'),
    (2, 'Viral Sensation', '🔥', 'Video reached 1000+ likes', 'video_1000_likes'),
    (3, 'AI Champion', '🤖', 'Achieved AI score of 9.0+', 'ai_score_9_plus'),
    (4, 'Weekly Winner', '🏆', 'Won a weekly contest', 'weekly_winner'),
    (5, 'Community Builder', '👥', 'Gained 1000+ followers', 'followers_1000_plus')
  `);
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  }
});

// API Routes

// Get all videos
app.get('/api/videos', (req, res) => {
  db.all(`
    SELECT v.*, 
           COUNT(l.id) as likeCount,
           CASE WHEN EXISTS(SELECT 1 FROM likes WHERE videoId = v.id AND username = ?) THEN 1 ELSE 0 END as isLiked
    FROM videos v 
    LEFT JOIN likes l ON v.id = l.videoId
    GROUP BY v.id
    ORDER BY v.uploadDate DESC
  `, [req.query.username || 'anonymous'], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Add mock thumbnails for demo (in real app, you'd generate these)
    const videosWithThumbnails = rows.map(video => ({
      ...video,
      thumbnail: video.thumbnail || getRandomThumbnail(),
      duration: video.duration || Math.floor(Math.random() * 30) + 10
    }));
    
    res.json(videosWithThumbnails);
  });
});

// Upload video
app.post('/api/videos', upload.single('video'), (req, res) => {
  const { title, description, username } = req.body;
  const videoFile = req.file;

  if (!videoFile) {
    return res.status(400).json({ error: 'No video file uploaded' });
  }

  if (!title || !username) {
    return res.status(400).json({ error: 'Title and username are required' });
  }

  const videoId = uuidv4();
  const thumbnail = getRandomThumbnail(); // In real app, generate thumbnail from video

  db.run(`
    INSERT INTO videos (id, title, description, username, filename, thumbnail, duration)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [videoId, title, description, username, videoFile.filename, thumbnail, 30], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Update user's video count
    db.run(`
      UPDATE users 
      SET videosCount = (SELECT COUNT(*) FROM videos WHERE username = ?)
      WHERE username = ?
    `, [username, username]);

    res.json({
      success: true,
      videoId: videoId,
      message: 'Video uploaded successfully!'
    });
  });
});

// Like/unlike video
app.post('/api/videos/:videoId/like', (req, res) => {
  const { videoId } = req.params;
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  // Check if already liked
  db.get('SELECT id FROM likes WHERE videoId = ? AND username = ?', [videoId, username], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (row) {
      // Unlike
      db.run('DELETE FROM likes WHERE videoId = ? AND username = ?', [videoId, username], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ liked: false, message: 'Video unliked' });
      });
    } else {
      // Like
      db.run('INSERT INTO likes (videoId, username) VALUES (?, ?)', [videoId, username], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        // Update video owner's total likes
        db.run(`
          UPDATE users 
          SET totalLikes = (
            SELECT COUNT(l.id) 
            FROM videos v 
            JOIN likes l ON v.id = l.videoId 
            WHERE v.username = (
              SELECT username FROM videos WHERE id = ?
            )
          )
          WHERE username = (
            SELECT username FROM videos WHERE id = ?
          )
        `, [videoId, videoId]);
        
        res.json({ liked: true, message: 'Video liked' });
      });
    }
  });
});

// Get trending videos (AI-ranked)
app.get('/api/videos/trending', (req, res) => {
  db.all(`
    SELECT v.*, 
           COUNT(l.id) as likeCount,
           COALESCE(v.views, 0) as views,
           COALESCE(v.shares, 0) as shares,
           COALESCE(v.comments, 0) as comments,
           (SELECT COUNT(*) FROM videos WHERE username = v.username) as userVideoCount,
           (SELECT AVG(likeCount) FROM (
             SELECT COUNT(l2.id) as likeCount 
             FROM videos v2 
             LEFT JOIN likes l2 ON v2.id = l2.videoId 
             WHERE v2.username = v.username 
             GROUP BY v2.id
           )) as avgUserLikes
    FROM videos v 
    LEFT JOIN likes l ON v.id = l.videoId
    WHERE v.uploadDate >= datetime('now', '-7 days')
    GROUP BY v.id
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Apply AI ranking
    const videosWithMetrics = rows.map(video => ({
      ...video,
      thumbnail: video.thumbnail || getRandomThumbnail(),
      duration: video.duration || Math.floor(Math.random() * 30) + 10,
      userReputation: Math.min((video.avgUserLikes || 0) / 10, 10), // Scale user reputation
      views: video.views || Math.floor(Math.random() * 1000) + 100 // Mock views for demo
    }));

    // Sort by AI ranking (engagement + content quality + recency)
    const rankedVideos = videosWithMetrics.sort((a, b) => {
      const scoreA = calculateAIScore(a);
      const scoreB = calculateAIScore(b);
      return scoreB - scoreA;
    });

    res.json(rankedVideos.slice(0, 10));
  });
});

// AI ranking function
function calculateAIScore(video) {
  const now = new Date();
  const uploadTime = new Date(video.uploadDate);
  const hoursSinceUpload = (now.getTime() - uploadTime.getTime()) / (1000 * 60 * 60);

  // Engagement rate
  const totalEngagement = video.likeCount + video.comments + video.shares;
  const engagementRate = video.views > 0 ? totalEngagement / video.views : 0;
  const engagementScore = Math.min(engagementRate * 100, 100);

  // Virality (shares worth more)
  const viralityScore = Math.min(
    (video.likeCount * 1 + video.comments * 2 + video.shares * 5) / 100,
    100
  );

  // Content quality (title analysis)
  const titleQuality = analyzeTitleQuality(video.title);
  const descriptionQuality = video.description ? analyzeDescriptionQuality(video.description) : 0;
  const contentQualityScore = (titleQuality + descriptionQuality) / 2;

  // Recency boost
  const recencyScore = Math.max(0, 100 - (hoursSinceUpload * 0.5));

  // User reputation
  const userReputationScore = Math.min(video.userReputation * 10, 100);

  // Weighted final score
  return (
    engagementScore * 0.35 +
    viralityScore * 0.25 +
    contentQualityScore * 0.15 +
    recencyScore * 0.15 +
    userReputationScore * 0.10
  );
}

function analyzeTitleQuality(title) {
  const length = title.length;
  const hasLocation = /tokyo|paris|london|morocco|scotland|highlands|street|park|beach|mountain|forest|city|village/i.test(title);
  const hasAtmosphere = /night|morning|sunset|sunrise|fog|mist|rain|snow|wind|quiet|busy|peaceful|vibrant|cozy|mysterious|romantic|energetic|calm|atmospheric|vibe/i.test(title);
  const hasEmotion = /beautiful|amazing|wonderful|magical|incredible|stunning|peaceful|relaxing|exciting|adventurous|romantic|cozy|happy|joyful|serene|mysterious|enchanting|dreamy/i.test(title);

  let score = 0;
  if (length >= 20 && length <= 60) score += 30;
  else if (length >= 10 && length <= 80) score += 20;
  else if (length >= 5 && length <= 100) score += 10;

  if (hasLocation) score += 25;
  if (hasAtmosphere) score += 25;
  if (hasEmotion) score += 20;

  return Math.min(score, 100);
}

function analyzeDescriptionQuality(description) {
  const length = description.length;
  const hasLocation = /tokyo|paris|london|morocco|scotland|highlands|street|park|beach|mountain|forest|city|village/i.test(description);
  const hasAtmosphere = /night|morning|sunset|sunrise|fog|mist|rain|snow|wind|quiet|busy|peaceful|vibrant|cozy|mysterious|romantic|energetic|calm|atmospheric|vibe/i.test(description);
  const hasStory = /walk|stroll|explore|discover|journey|adventure|experience|moment|memory|story|tale|day|evening|morning|afternoon|weekend|holiday|vacation|trip/i.test(description);

  let score = 0;
  if (length >= 50 && length <= 200) score += 30;
  else if (length >= 20 && length <= 300) score += 20;
  else if (length >= 10 && length <= 500) score += 10;

  if (hasLocation) score += 25;
  if (hasAtmosphere) score += 25;
  if (hasStory) score += 20;

  return Math.min(score, 100);
}

// Get weekly winners (AI-ranked)
app.get('/api/winners/weekly', (req, res) => {
  db.all(`
    SELECT v.*, 
           COUNT(l.id) as likeCount,
           COALESCE(v.views, 0) as views,
           COALESCE(v.shares, 0) as shares,
           COALESCE(v.comments, 0) as comments,
           (SELECT COUNT(*) FROM videos WHERE username = v.username) as userVideoCount,
           (SELECT AVG(likeCount) FROM (
             SELECT COUNT(l2.id) as likeCount 
             FROM videos v2 
             LEFT JOIN likes l2 ON v2.id = l2.videoId 
             WHERE v2.username = v.username 
             GROUP BY v2.id
           )) as avgUserLikes
    FROM videos v 
    LEFT JOIN likes l ON v.id = l.videoId
    WHERE v.uploadDate >= datetime('now', '-7 days')
    GROUP BY v.id
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const videosWithMetrics = rows.map(video => ({
      ...video,
      thumbnail: video.thumbnail || getRandomThumbnail(),
      duration: video.duration || Math.floor(Math.random() * 30) + 10,
      userReputation: Math.min((video.avgUserLikes || 0) / 10, 10),
      views: video.views || Math.floor(Math.random() * 1000) + 100
    }));

    // Sort by AI ranking and get top 5
    const rankedVideos = videosWithMetrics.sort((a, b) => {
      const scoreA = calculateAIScore(a);
      const scoreB = calculateAIScore(b);
      return scoreB - scoreA;
    });

    const winners = rankedVideos.slice(0, 5).map((video, index) => ({
      ...video,
      rank: index + 1,
      prize: index === 0 ? 'Dog Toy + $50' : index === 1 ? 'Dog Toy + $25' : 'Dog Toy'
    }));

    res.json(winners);
  });
});

// User login
app.post('/api/users/login', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    res.json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        profileImage: user.profileImage
      }
    });
  });
});

// User registration
app.post('/api/users/register', (req, res) => {
  const { username, email, bio, location, profileImage } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email are required' });
  }

  db.run(`
    INSERT INTO users (username, email, bio, location, profileImage)
    VALUES (?, ?, ?, ?, ?)
  `, [username, email, bio || '', location || '', profileImage || null], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: 'Username or email already exists' });
      } else {
        res.status(500).json({ error: err.message });
      }
      return;
    }

    // Award "First Upload" achievement
    db.run('INSERT INTO user_achievements (username, achievementId) VALUES (?, 1)', [username]);

    res.json({
      success: true,
      message: 'User registered successfully!'
    });
  });
});

// Get user profile
app.get('/api/users/:username', (req, res) => {
  const { username } = req.params;
  
  db.get(`
    SELECT u.*, 
           COUNT(DISTINCT v.id) as videosCount,
           COUNT(DISTINCT ua.achievementId) as achievementsCount
    FROM users u
    LEFT JOIN videos v ON u.username = v.username
    LEFT JOIN user_achievements ua ON u.username = ua.username
    WHERE u.username = ?
    GROUP BY u.username
  `, [username], (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Get user's achievements
    db.all(`
      SELECT a.*, ua.earnedDate
      FROM achievements a
      JOIN user_achievements ua ON a.id = ua.achievementId
      WHERE ua.username = ?
      ORDER BY ua.earnedDate DESC
    `, [username], (err, achievements) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({
        ...user,
        achievements: achievements || []
      });
    });
  });
});

// Get user's videos
app.get('/api/users/:username/videos', (req, res) => {
  const { username } = req.params;
  
  db.all(`
    SELECT v.*, COUNT(l.id) as likeCount
    FROM videos v 
    LEFT JOIN likes l ON v.id = l.videoId
    WHERE v.username = ?
    GROUP BY v.id
    ORDER BY v.uploadDate DESC
  `, [username], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const videosWithThumbnails = rows.map(video => ({
      ...video,
      thumbnail: video.thumbnail || getRandomThumbnail(),
      duration: video.duration || Math.floor(Math.random() * 30) + 10
    }));
    
    res.json(videosWithThumbnails);
  });
});

// Helper function to get random thumbnails for demo
function getRandomThumbnails() {
  return [
    'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1502602898534-47d6c5c0c0c5?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop'
  ];
}

function getRandomThumbnail() {
  const thumbnails = getRandomThumbnails();
  return thumbnails[Math.floor(Math.random() * thumbnails.length)];
}

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));
  
  // Handle React Router - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, 'build', 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`🚀 DogWalk.com backend running on port ${PORT}`);
  console.log(`📁 Upload directory: ${path.join(__dirname, 'uploads')}`);
  console.log(`🗄️  Database: ${path.join(__dirname, 'dogwalk.db')}`);
}); 