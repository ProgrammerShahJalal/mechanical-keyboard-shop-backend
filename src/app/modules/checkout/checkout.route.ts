import express from 'express';
import { CheckoutController } from './checkout.controller';
import { WebhookController } from './webhook.controller';

const router = express.Router();

router.post('/', CheckoutController.createOrder);
router.get('/orders', CheckoutController.getAllOrders);
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  WebhookController.handleStripeWebhook
);

export const checkoutRoutes = router;
