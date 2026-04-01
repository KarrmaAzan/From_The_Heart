export const requireArtistOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  if (req.user.role === 'artist' || req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({ message: 'Artist or admin access only' });
};

export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  if (req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({ message: 'Admin access only' });
};