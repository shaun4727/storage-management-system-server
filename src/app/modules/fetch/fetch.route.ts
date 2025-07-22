import { Router } from 'express';
import auth from '../../middleware/auth';
import { UserRole } from '../user/user.interface';
import { FetchController } from './fetch.controller';

const router = Router();

router.get('/all-folders', auth(UserRole.ADMIN, UserRole.USER), FetchController.FetchFolders);
router.get('/all-pdfs', auth(UserRole.ADMIN, UserRole.USER), FetchController.FetchPdfs);
router.get('/all-images', auth(UserRole.ADMIN, UserRole.USER), FetchController.FetchImages);
router.get('/all-notes', auth(UserRole.ADMIN, UserRole.USER), FetchController.FetchNotes);
router.get('/group-file-in-group', auth(UserRole.ADMIN, UserRole.USER), FetchController.getGroupByFiles);
router.get('/single-file/:fileId', auth(UserRole.ADMIN, UserRole.USER), FetchController.fetchSingleFile);

export const FetchRoutes = router;
