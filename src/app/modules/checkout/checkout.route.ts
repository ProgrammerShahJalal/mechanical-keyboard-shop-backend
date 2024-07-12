import express from 'express';
import { CheckoutController } from './checkout.controller';

const router = express.Router();

router.post('/', CheckoutController.createOrder);

export const checkoutRoutes = router;
