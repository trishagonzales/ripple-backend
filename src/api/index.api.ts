import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import profileRoutes from './routes/profile.route';
import postRoutes from './routes/post.route';
import { Express } from 'express';

export default (app: Express) => {
  app.use('/api', authRoutes);
  app.use('/api', userRoutes);
  app.use('/api', profileRoutes);
  app.use('/api', postRoutes);
};
