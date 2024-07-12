import { Router } from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';

const router = Router();

router.post(
  '/signup',
  validateRequest(UserValidation.createUser),
  UserController.signUp
);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);

router.get('/', UserController.getAllUsers);
router.get(
  '/:id',

  UserController.getUserById
);
router.put(
  '/:id',

  UserController.updateUser
);
router.post('/refresh-token', UserController.refreshToken);

router.delete('/:id', UserController.deleteUser);

export const userRouters = router;
