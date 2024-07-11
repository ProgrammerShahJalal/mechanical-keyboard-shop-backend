import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import * as cartService from './cart.service';

const getCart = catchAsync(async (req: Request, res: Response) => {
  const userInfo = req.body;

  const cart = await cartService.getCart(userInfo);

  if (!cart) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Cart is empty',
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart retrieved successfully',
    data: cart,
  });
});

export const CartController = {
  getCart,
};
