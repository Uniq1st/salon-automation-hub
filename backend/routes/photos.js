import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  getAllPhotos, getPhoto, savePhoto, analyzePhoto, generateVariations, markPosted,
} from '../services/photos.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

const PHOTOS_DIR = path.resolve('uploads/photos');
const GENERATED_DIR = path.resolve('uploads/generated');

// Serve photo files
router.get('/file/:filename', (req, res) => {
  const filepath = path.join(PHOTOS_DIR, req.params.filename);
  if (!fs.existsSync(filepath)) return res.status(404).json({ error: 'Not found' });
  res.sendFile(filepath);
});

router.get('/generated/:filename', (req, res) => {
  const filepath = path.join(GENERATED_DIR, req.params.filename);
  if (!fs.existsSync(filepath)) return res.status(404).json({ error: 'Not found' });
  res.sendFile(filepath);
});

// List all photos
router.get('/', (req, res) => {
  res.json({ success: true, photos: getAllPhotos() });
});

// Upload one or more photos
router.post('/upload', upload.array('photos', 20), async (req, res) => {
  try {
    const saved = await Promise.all(req.files.map(f => savePhoto(f)));
    res.json({ success: true, photos: saved, count: saved.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Analyze a photo with Claude vision
router.post('/:id/analyze', async (req, res) => {
  try {
    const analysis = await analyzePhoto(req.params.id);
    res.json({ success: true, analysis, photo: getPhoto(req.params.id) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Generate AI variations with DALL-E
router.post('/:id/generate', async (req, res) => {
  try {
    const { count = 2 } = req.body;
    const generated = await generateVariations(req.params.id, count);
    res.json({ success: true, generated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single photo
router.get('/:id', (req, res) => {
  const photo = getPhoto(req.params.id);
  if (!photo) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true, photo });
});

export default router;
