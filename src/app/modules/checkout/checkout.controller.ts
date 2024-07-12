import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CheckoutService } from './checkout.service';
import { ICreateOrder, IProcessStripePayment } from './checkout.interface';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const { userDetails, cartItems, paymentMethod }: ICreateOrder = req.body;

  // Validate request body
  if (!userDetails || !cartItems || !paymentMethod) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: 'Missing required fields in request body',
      data: 'Missing required fields',
    });
  }

  console.log('req.body', req.body);

  const order = await CheckoutService.createOrder(
    userDetails,
    cartItems,
    paymentMethod
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Order placed successfully',
    data: order,
  });
});

const processStripePayment = catchAsync(async (req: Request, res: Response) => {
  const { orderId, paymentToken }: IProcessStripePayment = req.body;

  if (!orderId || !paymentToken) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: 'Missing required fields in request body',
      data: 'Missing required fields',
    });
  }

  const paymentResult = await CheckoutService.processStripePayment(
    orderId.toString(),
    paymentToken
  );

  sendResponse(res, {
    success: paymentResult.success,
    statusCode: paymentResult.success ? httpStatus.OK : httpStatus.BAD_REQUEST,
    message: paymentResult.message,
    data: paymentResult.data,
  });
});

export const CheckoutController = {
  createOrder,
  processStripePayment,
};
