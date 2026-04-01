import Artist from '../models/Artist.js';
import Music from '../models/Music.js';
import Album from '../models/Album.js';
import path from 'path';
import fs from 'fs';

const getBaseUrl = (req) => `${req.protocol}://${req.get('host')}`;

const normalizeArtistImage = (req, artist) => {
  const artistObj = artist.toObject ? artist.toObject() : artist;

  return {
    ...artistObj,
    image: artistObj.image?.startsWith('http')
      ? artistObj.image
      : `${getBaseUrl(req)}${artistObj.image}`,
  };
};

const createSlug = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

// Admin creates artist profile
export const createArtist = async (req, res) => {
  try {
    const { name, bio, image } = req.body;

    if (!name || !bio) {
      return res.status(400).json({ message: 'Name and bio are required' });
    }

    const slug = createSlug(name);

    const existingArtist = await Artist.findOne({
      $or: [{ name: name.trim() }, { slug }],
    });

    if (existingArtist) {
      return res.status(400).json({ message: 'Artist already exists' });
    }

    let imageUrl = '/uploads/default-artist.jpg';

    if (image?.startsWith('http')) {
      imageUrl = image;
    } else if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const artist = new Artist({
      name: name.trim(),
      slug,
      bio: bio.trim(),
      image: imageUrl,
    });

    await artist.save();

    res.status(201).json({
      message: 'Artist created successfully',
      artist: normalizeArtistImage(req, artist),
    });
  } catch (error) {
    console.error('Error creating artist:', error);
    res.status(500).json({ message: 'Failed to create artist' });
  }
};

// Keep old name if you're already using this route
export const registerArtist = createArtist;

export const getArtists = async (req, res) => {
  try {
    const artists = await Artist.find().sort({ createdAt: -1 });

    res.status(200).json(artists.map((artist) => normalizeArtistImage(req, artist)));
  } catch (error) {
    console.error('Error fetching artists:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getArtistBySlug = async (req, res) => {
  try {
    const artist = await Artist.findOne({ slug: req.params.slug });

    if (!artist) {
      return res.status(404).json({ message: 'Artist not found.' });
    }

    const topSongs = await Music.find({ artist: artist._id })
      .sort({ playCount: -1 })
      .limit(5)
      .populate('album', 'title coverImage')
      .lean();

    const allSongs = await Music.find({ artist: artist._id })
      .sort({ releaseDate: -1 })
      .populate('album', 'title coverImage')
      .lean();

    res.status(200).json({
      artist: normalizeArtistImage(req, artist),
      topSongs,
      allSongs,
    });
  } catch (error) {
    console.error('Error fetching artist page:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export const getArtistTracks = async (req, res) => {
  try {
    const artist = await Artist.findOne({ slug: req.params.slug });

    if (!artist) {
      return res.status(404).json({ message: 'Artist not found.' });
    }

    const tracks = await Music.find({ artist: artist._id })
      .populate('album', 'title coverImage')
      .sort({ releaseDate: -1 });

    res.status(200).json(tracks);
  } catch (error) {
    console.error('Error fetching artist tracks:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getArtistAlbums = async (req, res) => {
  try {
    const artist = await Artist.findOne({ slug: req.params.slug });

    if (!artist) {
      return res.status(404).json({ message: 'Artist not found.' });
    }

    const albums = await Album.find({ artist: artist._id })
      .populate({
        path: 'songs',
        populate: {
          path: 'artist',
          select: 'name slug',
        },
      })
      .sort({ releaseDate: -1 });

    res.status(200).json(albums);
  } catch (error) {
    console.error('Error fetching artist albums:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateArtistImage = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    if (
      artist.image &&
      artist.image.includes('/uploads/') &&
      !artist.image.includes('default-artist.jpg')
    ) {
      const oldImagePath = path.join(path.resolve(), 'uploads', path.basename(artist.image));

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    artist.image = `/uploads/${req.file.filename}`;
    await artist.save();

    res.json({
      message: 'Artist image updated',
      artist: normalizeArtistImage(req, artist),
    });
  } catch (error) {
    console.error('Update artist image error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};