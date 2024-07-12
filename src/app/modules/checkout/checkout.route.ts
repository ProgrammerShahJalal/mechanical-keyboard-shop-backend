import express from 'express';
import { CheckoutController } from './checkout.controller';

const router = express.Router();

router.post('/checkout', CheckoutController.createOrder);
router.get('/orders', CheckoutController.getAllOrders);
router.get('/orders/:email', CheckoutController.getOrderByEmail);

export const checkoutRoutes = router;
