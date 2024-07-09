import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import * as cartService from './cart.service';

const addToCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  const cart = await cartService.addToCart(userId, productId, quantity);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product added to cart successfully',
    data: cart,
  });
});

const getCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const cart = await cartService.getCart(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart retrieved successfully',
    data: cart,
  });
});

const updateCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  const cart = await cartService.updateCart(userId, productId, quantity);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart updated successfully',
    data: cart,
  });
});

const removeFromCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { productId } = req.body;

  const cart = await cartService.removeFromCart(userId, productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product removed from cart successfully',
    data: cart,
  });
});

export const CartController = {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
};
