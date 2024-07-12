import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CheckoutService } from './checkout.service';
import { ICreateOrder } from './checkout.interface';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const { userDetails, cartItems, paymentMethod }: ICreateOrder = req.body;

  // Validate request body
  if (!userDetails || !cartItems || !paymentMethod) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: 'Missing required fields in request body',
      data: 'Missing Required fields',
    });
  }

  const order = await CheckoutService.createOrder(
    userDetails,
    cartItems,
    paymentMethod
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Order placed successfully',
    data: { order, sessionId: order.sessionId },
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.query;

  let orders;
  if (email) {
    orders = await CheckoutService.getOrdersByEmail(email as string);
  } else {
    orders = await CheckoutService.getAllOrders();
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Orders fetched successfully',
    data: orders,
  });
});

export const CheckoutController = {
  createOrder,
  getAllOrders,
};
