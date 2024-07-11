import express from 'express';
import { CheckoutController } from './checkout.controller';

const router = express.Router();

router.post('/', CheckoutController.createOrder);
router.post('/stripe', CheckoutController.processStripePayment);

export const checkoutRoutes = router;
