import multer from 'multer';
import { HttpError } from '../../util/errorHandler';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, process.cwd() + '/public'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

// const upload = multer({ storage, onError: (err: any, next: any) => return throw new HttpError('Unexpected error occurred.', 500) });

export const sendFileOptions = {
  root: process.cwd() + '/public'
};

export default upload;
