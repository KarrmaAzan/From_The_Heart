import mongoose from 'mongoose';

const musicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 0,
    },
    releaseDate: {
      type: Date,
      default: Date.now,
    },
    playCount: {
      type: Number,
      default: 0,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: true,
      index: true,
    },
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album',
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

musicSchema.index({ title: 'text', description: 'text' });

const Music = mongoose.model('Music', musicSchema);
export default Music;