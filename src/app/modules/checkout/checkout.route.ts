import express from 'express';
import { CheckoutController } from './checkout.controller';

const router = express.Router();

router.post('/checkout', CheckoutController.createOrder);
router.get('/orders', CheckoutController.getAllOrders);

export const checkoutRoutes = router;
