import { Router } from 'express';
import auth from '../../middleware/auth';
import clientInfoParser from '../../middleware/clientInfoParser';
import validateRequest from '../../middleware/validateRequest';
import { UserController } from './user.controller';
import { UserRole } from './user.interface';
import { UserValidation } from './user.validation';

const router = Router();

router.get('/', auth(UserRole.ADMIN), UserController.getAllUser);

router.get('/me', auth(UserRole.ADMIN, UserRole.USER), UserController.myProfile);
router.post('/password-update', auth(UserRole.ADMIN, UserRole.USER), UserController.updateProfilePasswordController);
router.post('/profile', auth(UserRole.ADMIN, UserRole.USER), UserController.updateProfileController);

router.post('/register', clientInfoParser, validateRequest(UserValidation.userValidationSchema), UserController.registerUser);

export const UserRoutes = router;
