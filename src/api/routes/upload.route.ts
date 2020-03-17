import express from 'express';
import auth from '../middleware/auth';
import a from '../middleware/asyncWrap';
import upload, { sendFileOptions } from '../middleware/multer';
import { UserService } from '../../services/UserService';
import { PostService } from '../../services/PostService';
import { HttpError } from '../../util/errorHandler';
const log = require('debug')('uploadRoutes');

const router = express.Router();

//  GET POST IMAGE
router.get(
  '/uploads/image/:filename',
  a(async (req, res) => {
    const filename = req.params.filename;
    if (!filename) throw new HttpError('Image filename is required.', 400);

    res.status(200).sendFile(filename, sendFileOptions, err => log(err));
  })
);

//  UPLOAD POST IMAGE
router.put(
  '/uploads/image/:id',
  auth,
  upload.single('image'),
  a(async (req, res) => {
    const { file, params, user } = req;
    const filename = await PostService.uploadImage(file.filename, params.id, user._id);

    res.status(200).send(filename);
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
router.put(
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
