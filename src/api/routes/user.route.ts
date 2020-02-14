import express from 'express';
import validate from '../middleware/validate';
import auth from '../middleware/auth';
import a from '../middleware/asyncWrap';
import { AuthService, SignupInput } from '../../services/AuthService';

const router = express.Router();

/**
 * Create New User
 */
router.post(
  '/users',
  a(async (req, res) => {
    const validInput = validate<SignupInput>(req.body, 'signup');
    const { user, token } = await AuthService.signup(validInput);
    const userData = await user.getAccountData();

    res
      .status(201)
      .header('x-auth-token', token)
      .send(userData);
  })
);

/**
 *  Get User Data
 */
router.get(
  '/users/me',
  auth,
  a(async (req, res) => {
    const user = req.user;
    const userData = await user.getAccountData();

    res.status(200).send(userData);
  })
);

/**
 *  Update Email
 */
router.put(
  '/users/email',
  auth,
  a(async (req, res) => {
    const validInput = validate<string>(req.body.email, 'email');
    const user = req.user;
    const email = await user.updateEmail(validInput);

    res.status(200).send(email);
  })
);

/**
 *  Update Password
 */
router.put(
  '/users/password',
  auth,
  a(async (req, res) => {
    const validInput = validate<string>(req.body.password, 'password');
    const user = req.user;
    await user.updatePassword(validInput);

    res.status(200).send('Successfully updated password.');
  })
);

/**
 *  Validate password
 */
router.post(
  '/users/validate-password',
  auth,
  a(async (req, res) => {
    const validInput = validate<string>(req.body.password, 'password');
    const user = req.user;
    await user.validatePassword(validInput);

    res.status(200).send('Password is valid.');
  })
);

/**
 * Delete User
 */
router.delete(
  '/users/me',
  auth,
  a(async (req, res) => {
    const user = req.user;
    await user.deleteAccount();

    res.status(200).send('Successfully deleted user.');
  })
);

export default router;
