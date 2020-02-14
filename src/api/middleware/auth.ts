import jwt from 'jsonwebtoken';
import config from '../../config/config';
import { HttpError } from '../../util/errorHandler';
import { AuthService } from '../../services/AuthService';

export default async (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) throw new HttpError('Access denied.', 401);

    jwt.verify(token, config.JWT_KEY, async (err, decoded) => {
      if (err) throw new HttpError('Invalid token.', 400);

      const user = await AuthService.attachUser(decoded._id);
      if (!user) throw new HttpError('User not found', 404);

      req.user = user;
      next();
    });
  } catch (e) {
    next(e);
  }
};
