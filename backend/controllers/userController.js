import User from '../models/User.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updatePushToken = async (req, res, next) => {
  const { pushToken } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.pushToken = pushToken;
    await user.save();

    res.json({ message: 'Push token updated successfully' });
  } catch (error) {
    next(error);
  }
};