import express from 'express';
import validate from '../middleware/validate';
import auth from '../middleware/auth';
import a from '../middleware/asyncWrap';
import { AuthService, SignupInput } from '../../services/AuthService';

const router = express.Router();

//  CREATE NEW USER
router.post(
  '/users',
  a(async (req, res) => {
    const validInput = validate<SignupInput>(req.body, 'signup');
    const { user, token } = await AuthService.signup(validInput);
    const userData = await user.getAccountData();

    res.status(201).header('x-auth-token', token).send(userData);
  })
);

//  GET USER DATA
router.get(
  '/users/me',
  auth,
  a(async (req, res) => {
    const user = req.user;
    const userData = await user.getAccountData();

    res.status(200).send(userData);
  })
);

//  UPDATE EMAIL
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

//  UPDATE PASSWORD
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

//  VALIDATE PASSWORD
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

//  DELETE USER
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
