import multer from 'multer';
import { createFolderFun } from './createFolder';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const file_path = file.fieldname === 'pdf' ? 'pdf' : 'images';
    createFolderFun('/src/files/' + file_path);

    cb(null, process.cwd() + ('/src/files/' + file_path));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname);
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});
