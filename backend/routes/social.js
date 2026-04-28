import express from 'express';
import { postToInstagram, getInstagramAccount } from '../services/instagram.js';
import { markPosted, getPhoto } from '../services/photos.js';

const router = express.Router();

// Get Instagram account info
router.get('/instagram/account', async (req, res) => {
  try {
    const account = await getInstagramAccount();
    res.json({ success: true, account });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Post a photo to Instagram
router.post('/instagram/post', async (req, res) => {
  try {
    const { photoId, filename, caption, hashtags, isGenerated = false } = req.body;

    if (!filename || !caption) {
      return res.status(400).json({ success: false, error: 'filename and caption required' });
    }

    const result = await postToInstagram({ filename, caption, hashtags: hashtags || [], isGenerated });

    // Mark as posted in the DB
    if (photoId) markPosted(photoId, 'instagram', result.postId);

    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Post to TikTok (stub — will wire up after Instagram is confirmed)
router.post('/tiktok/post', async (req, res) => {
  res.json({
    success: false,
    error: 'TikTok posting coming soon — Instagram first!',
  });
});

export default router;
