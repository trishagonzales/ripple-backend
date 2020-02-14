import express, { Request, Response } from 'express';
import validate from '../middleware/validate';
import a from '../middleware/asyncWrap';
import { AuthService, LoginInput } from '../../services/AuthService';

const router = express.Router();

/**
 * Login user
 */
router.post(
  '/auth',
  a(async (req: Request, res: Response) => {
    const validInput = validate<LoginInput>(req.body, 'login');
    const { user, token } = await AuthService.login(validInput);
    const userData = await user.getAccountData();

    res
      .status(200)
      .header('x-auth-token', token)
      .send(userData);
  })
);

export default router;
