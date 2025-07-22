import { Router } from 'express';
import auth from '../../middleware/auth';
import { UserRole } from '../user/user.interface';
import { OperationController } from './operation.controller';

const router = Router();

router.post('/copy-file', auth(UserRole.ADMIN, UserRole.USER), OperationController.copyFile);
router.post('/rename-file/:fileId', auth(UserRole.ADMIN, UserRole.USER), OperationController.renameFile);
router.get('/duplicate-file/:fileId', auth(UserRole.ADMIN, UserRole.USER), OperationController.duplicateAfile);
router.get('/make-favourite-file/:fileId', auth(UserRole.ADMIN, UserRole.USER), OperationController.makeAfileFavourite);
router.delete('/delete-file/:fileId', auth(UserRole.ADMIN, UserRole.USER), OperationController.deleteAfileController);
router.post('/filter-files', auth(UserRole.ADMIN, UserRole.USER), OperationController.filterFileController);

export const OperationRoutes = router;
