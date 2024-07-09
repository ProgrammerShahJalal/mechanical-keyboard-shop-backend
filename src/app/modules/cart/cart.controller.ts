import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import * as cartService from './cart.service';
import { CartValidation } from './cart.validation';

const addToCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { productId, quantity } = req.body;

  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'Unauthorized',
      data: null,
    });
  }

  CartValidation.addToCartSchema.parse(req.body);

  const cart = await cartService.addToCart(userId, productId, quantity);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product added to cart successfully',
    data: cart,
  });
});

const getCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'Unauthorized',
      data: null,
    });
  }

  const cart = await cartService.getCart(userId);

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

const updateCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { productId, quantity } = req.body;

  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'Unauthorized',
      data: null,
    });
  }

  CartValidation.updateCartSchema.parse(req.body);

  const cart = await cartService.updateCart(userId, productId, quantity);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart updated successfully',
    data: cart,
  });
});

const removeFromCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { productId } = req.body;

  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'Unauthorized',
      data: null,
    });
  }

  CartValidation.removeFromCartSchema.parse(req.body);

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
