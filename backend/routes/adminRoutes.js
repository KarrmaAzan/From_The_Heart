import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';
import { createArtistAccount } from '../controllers/adminController.js';

const router = express.Router();

router.post('/artist-account', protect, requireAdmin, createArtistAccount);

export default router;