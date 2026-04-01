import express from 'express';
import {
  registerArtist,
  getArtists,
  getArtistBySlug,
  getArtistTracks,
  getArtistAlbums,
  updateArtistImage,
} from '../controllers/artistController.js';
import upload from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';
import { createArtistAccount } from "../controllers/adminController.js";
const router = express.Router();

// Create artist
router.post('/', protect, requireAdmin, upload.single('image'), registerArtist);

// Get all artists
router.get('/', getArtists);

// Get one artist page by slug
router.get('/:slug', getArtistBySlug);

// Get tracks for one artist
router.get('/:slug/tracks', getArtistTracks);

// Get albums for one artist
router.get('/:slug/albums', getArtistAlbums);

// Update artist image
router.put('/:id/image', protect, requireAdmin, upload.single('image'), updateArtistImage);

// Create Artist Account (Admin Only) 
router.post("/artist-account", protect, requireAdmin, createArtistAccount);

export default router;