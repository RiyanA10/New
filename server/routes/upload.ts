import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created upload directory:', uploadDir);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Get user ID from request headers or default to 'anonymous'
    const userId = req.headers['x-user-id'] || 'anonymous';
    const userDir = path.join(uploadDir, userId);
    // Ensure user directory exists
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Handle image uploads
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Construct the file path relative to the public directory
    const filePath = `/uploads/${req.headers['x-user-id'] || 'anonymous'}/${req.file.filename}`;

    return res.status(200).json({
      url: filePath,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to upload file' });
  }
});

export default router;