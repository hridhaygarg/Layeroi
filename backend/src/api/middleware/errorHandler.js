import { logger } from '../../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled error', err, { path: req.path, method: req.method });
  res.status(500).json({ error: 'Internal server error' });
};
