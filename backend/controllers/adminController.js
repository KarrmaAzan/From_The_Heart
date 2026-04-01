import User from '../models/User.js';
import Artist from '../models/Artist.js';

const createSlug = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

export const createArtistAccount = async (req, res) => {
  try {
    const { name, email, password, bio, image } = req.body;

    if (!name || !email || !password || !bio) {
      return res.status(400).json({
        message: 'Name, email, password, and bio are required',
      });
    }

    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const slug = createSlug(name);

    const existingArtist = await Artist.findOne({
      $or: [{ name: name.trim() }, { slug }],
    });

    if (existingArtist) {
      return res.status(400).json({ message: 'Artist already exists' });
    }

    const artist = await Artist.create({
      name: name.trim(),
      slug,
      bio: bio.trim(),
      image: image || '/uploads/default-artist.jpg',
    });

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: 'artist',
      artist: artist._id,
    });

    res.status(201).json({
      message: 'Artist account created successfully',
      artist,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        artist: user.artist,
      },
    });
  } catch (error) {
    console.error('Error creating artist account:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};