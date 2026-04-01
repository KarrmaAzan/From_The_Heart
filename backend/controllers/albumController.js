import Album from '../models/Album.js';
import Music from '../models/Music.js';
import Artist from '../models/Artist.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

export const createAlbum = async (req, res) => {
  try {
    const { title, description, releaseDate, artistId } = req.body;

    const coverFile = req.files?.coverImage?.[0];
    const trackFiles = req.files?.tracks || [];

    if (!title || !artistId) {
      return res.status(400).json({ message: 'Title and artistId are required.' });
    }

    if (!coverFile || trackFiles.length === 0) {
      return res.status(400).json({
        message: 'Cover image and tracks are required.',
      });
    }

    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found.' });
    }

    const coverUpload = await cloudinary.uploader.upload(coverFile.path, {
      folder: 'album_covers',
    });
    fs.unlinkSync(coverFile.path);

    const album = new Album({
      title,
      description: description || '',
      releaseDate: releaseDate || Date.now(),
      coverImage: coverUpload.secure_url,
      artist: artist._id,
      songs: [],
    });

    await album.save();

    const trackIds = [];

    for (const file of trackFiles) {
      const upload = await cloudinary.uploader.upload(file.path, {
        resource_type: 'video',
        folder: `music/albums/${title}`,
      });

      fs.unlinkSync(file.path);

      const track = new Music({
        title: file.originalname.split('.').slice(0, -1).join('.') || file.originalname,
        fileUrl: upload.secure_url,
        releaseDate: releaseDate || Date.now(),
        artist: artist._id,
        album: album._id,
      });

      await track.save();
      trackIds.push(track._id);
    }

    album.songs = trackIds;
    await album.save();

    const populatedAlbum = await Album.findById(album._id)
      .populate({
        path: 'songs',
        populate: { path: 'artist', select: 'name slug' },
      })
      .populate('artist', 'name slug image');

    res.status(201).json({
      message: 'Album uploaded successfully.',
      album: populatedAlbum,
    });
  } catch (error) {
    console.error('Album upload failed:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getAlbums = async (req, res) => {
  try {
    const { artistId } = req.query;

    const filter = artistId ? { artist: artistId } : {};

    const albums = await Album.find(filter)
      .populate('artist', 'name slug image')
      .populate({
        path: 'songs',
        populate: { path: 'artist', select: 'name slug' },
      })
      .sort({ releaseDate: -1 });

    res.status(200).json(albums);
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id)
      .populate('artist', 'name slug image')
      .populate({
        path: 'songs',
        populate: { path: 'artist', select: 'name slug' },
      });

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    res.json(album);
  } catch (err) {
    console.error('Album fetch error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};