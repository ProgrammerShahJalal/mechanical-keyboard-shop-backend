import { Router } from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const router = Router();

router.post(
  '/signup',
  validateRequest(UserValidation.createUser),
  UserController.signUp
);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
//ONLY ADMIN CAN GET ALL USERS
router.get('/', auth(USER_ROLE.admin), UserController.getAllUsers);
router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserController.getUserById
);
router.put(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(UserValidation.updateUser),
  UserController.updateUser
);

router.delete('/:id', auth(USER_ROLE.admin), UserController.deleteUser);

export const userRouters = router;
