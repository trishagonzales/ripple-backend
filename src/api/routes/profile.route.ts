import express, { Request, Response, NextFunction } from 'express';
import validate from '../middleware/validate';
import auth from '../middleware/auth';
import a from '../middleware/asyncWrap';
import { UserService } from '../../services/UserService';

const router = express.Router();

/**
 * Get all profiles
 */
router.get(
  '/profiles',
  a(async (req: Request, res: Response, next: NextFunction) => {
    const { pageSize, pageNumber, sortBy } = req.query;

    const profiles = await UserService.getAllProfiles({ pageSize, pageNumber, sortBy });
    res.status(200).send(profiles);
  })
);

/**
 * Get one profile
 */
router.get(
  '/profiles/:id',
  a(async (req: Request, res: Response, next: NextFunction) => {
    const profile = await UserService.getProfile(req.params.id);
    res.status(200).send(profile);
  })
);

/**
 * Update profile
 */
router.put(
  '/profiles/me',
  auth,
  a(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const validInput = validate(req.body, 'profile');

    const newProfile = await user.updateProfile(validInput);
    res.status(200).send(newProfile);
  })
);

export default router;