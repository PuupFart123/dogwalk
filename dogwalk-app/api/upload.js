const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// In-memory storage for demo (in production, use cloud storage)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  }
});

module.exports = (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Use multer to handle file upload
  upload.single('video')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const { title, description, username } = req.body;
    const videoFile = req.file;

    if (!videoFile) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    if (!title || !username) {
      return res.status(400).json({ error: 'Title and username are required' });
    }

    // For demo purposes, just return success
    // In production, you'd save to cloud storage and database
    const videoId = uuidv4();

    res.json({
      success: true,
      videoId: videoId,
      message: 'Video uploaded successfully! (Demo mode - file not actually stored)',
      fileSize: videoFile.size,
      fileName: videoFile.originalname
    });
  });
}; 