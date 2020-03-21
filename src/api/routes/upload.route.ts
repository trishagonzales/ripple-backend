import express from 'express';
import auth from '../middleware/auth';
import a from '../middleware/asyncWrap';
import upload, { sendFileOptions } from '../middleware/multer';
import { UserService } from '../../services/UserService';
import { PostService } from '../../services/PostService';
import { HttpError } from '../../util/errorHandler';
import { MulterError } from 'multer';
const log = require('debug')('uploadRoutes');

const router = express.Router();

//  GET POST IMAGE
router.get(
  '/uploads/image/:id',
  a(async (req, res) => {
    const filename = await PostService.getImage(req.params.id);

    res.sendFile(filename, sendFileOptions, (err) => {
      if (err) throw err;
    });
  })
);

//  UPLOAD POST IMAGE
router.put(
  '/uploads/image/:id',
  auth,
  a(async (req, res, next) => {
    const { params, user } = req;
    try {
      await PostService.validateImageUpload(params.id, user._id);
      next();
    } catch (e) {
      next(e);
    }
  }),
  upload.single('image'),
  a(async (req, res) => {
    const { file, params } = req;
    const filename = await PostService.uploadImage(file.filename, params.id);

    res.status(200).send(filename);
  })
);

//  GET USER'S AVATAR / PROFILE PICTURE
router.get(
  '/uploads/avatar/:id',
  a(async (req, res, next) => {
    const filename = await UserService.getAvatar(req.params.id);

    res.sendFile(filename, sendFileOptions, (err) => {
      if (err) throw err;
    });
  })
);

//  UPLOAD USER'S AVATAR / PROFILE PICTURE
router.put(
  '/uploads/avatar',
  auth,
  a((req, res, next) => {
    const uploadSingle = upload.single('avatar');
    uploadSingle(req, res, async (err) => {
      if (err) next(err);

      const { file, user } = req;
      await user.uploadAvatar(file.filename);

      res.status(200).send(file.filename);
    });
  })
);

export default router;
