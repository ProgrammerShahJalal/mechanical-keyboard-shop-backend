import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Order } from './checkout.model';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return res.status(400).send(`Webhook Error: ${errorMessage}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await Order.findOneAndUpdate(
        { paymentIntentId: paymentIntent.id },
        { status: 'completed' }
      );
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
      await Order.findOneAndUpdate(
        { paymentIntentId: paymentIntentFailed.id },
        { status: 'failed' }
      );
      break;
    }
    default: {
      console.log(`Unhandled event type ${event.type}`);
    }
  }

  res.send();
};

export const WebhookController = {
  handleStripeWebhook,
};
