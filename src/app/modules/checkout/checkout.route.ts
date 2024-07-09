import express from 'express';
import { CheckoutController } from './checkout.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post('/', auth(USER_ROLE.user), CheckoutController.createOrder);
router.post(
  '/stripe',
  auth(USER_ROLE.user),
  CheckoutController.processStripePayment
);

export const checkoutRoutes = router;
