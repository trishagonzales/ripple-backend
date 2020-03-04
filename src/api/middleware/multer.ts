import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, process.cwd() + '/public'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

export const sendFileOptions = {
  root: process.cwd() + '/public'
};

export default upload;
