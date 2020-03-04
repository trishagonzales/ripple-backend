import express from 'express';
import auth from '../middleware/auth';
import a from '../middleware/asyncWrap';
import upload, { sendFileOptions } from '../middleware/multer';
import { UserService } from '../../services/UserService';
import { PostService } from '../../services/PostService';

const router = express.Router();

//  GET POST IMAGE
router.get(
  '/uploads/image/:id',
  a(async (req, res) => {
    const filename = await PostService.getImage(req.params.id);
    if (!filename) res.status(200).send();

    res.status(200).sendFile(filename, sendFileOptions);
  })
);

//  UPLOAD POST IMAGE
router.post(
  '/uploads/image/:id',
  auth,
  upload.single('image'),
  a(async (req, res) => {
    const { file, params, user } = req;
    await PostService.uploadImage(file.filename, params.id, user._id);

    res.status(200).send();
  })
);

//  GET USER'S AVATAR / PROFILE PICTURE
router.get(
  '/uploads/avatar/:id',
  a(async (req, res) => {
    const filename = await UserService.getAvatar(req.params.id);
    if (!filename) res.status(200).send('No avatar image found.');

    res.status(200).sendFile(filename, sendFileOptions);
  })
);

//  UPLOAD USER'S AVATAR / PROFILE PICTURE
router.post(
  '/uploads/avatar',
  auth,
  upload.single('avatar'),
  a(async (req, res) => {
    const { file, user } = req;
    await user.uploadAvatar(file.filename);

    res.status(200).send();
  })
);

export default router;
