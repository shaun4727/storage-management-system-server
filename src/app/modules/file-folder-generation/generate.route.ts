import { Router } from 'express';
import auth from '../../middleware/auth';
import { upload } from '../../utils/fileUpload';
import { UserRole } from '../user/user.interface';
import { GenController } from './generate.controller';

const router = Router();

router.post('/create-docx-file', auth(UserRole.ADMIN, UserRole.USER), GenController.GenerateDocFile);

router.post('/upload-files', auth(UserRole.ADMIN, UserRole.USER), upload.fields([{ name: 'pdf' }, { name: 'images' }]), GenController.storeFiles);

router.post('/create-folder', auth(UserRole.ADMIN, UserRole.USER), GenController.createFolder);

export const GenRoutes = router;
