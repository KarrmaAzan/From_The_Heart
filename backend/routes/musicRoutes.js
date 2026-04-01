import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { requireArtistOrAdmin } from '../middleware/roleMiddleware.js';
import {
  uploadMiddleware,
  createMusic,
  getAllMusic,
  streamMusic,
  incrementPlayCount,
} from '../controllers/musicController.js';

const router = express.Router();

// Upload music
router.post('/', protect, requireArtistOrAdmin, uploadMiddleware, createMusic);

// Get all music
router.get('/', getAllMusic);

// Stream a song by ID
router.get('/stream/:id', streamMusic);

// Increment play count
router.patch('/increment-playcount/:id', incrementPlayCount);

export default router;