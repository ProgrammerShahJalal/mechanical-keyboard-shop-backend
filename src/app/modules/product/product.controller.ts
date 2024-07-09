import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import * as productService from './product.service';
import { productSchema } from './product.validation';
import { IProduct } from './product.interface';

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const parsedProduct = productSchema.parse(req.body);
  const newProduct = await productService.createProduct(parsedProduct);

  sendResponse<IProduct>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product created successfully',
    data: newProduct,
  });
});

const getProducts = catchAsync(async (req: Request, res: Response) => {
  const { search, brand, minPrice, maxPrice, sortBy, sortOrder } = req.query;

  const products = await productService.getProducts({
    search: search?.toString(),
    brand: brand?.toString(),
    minPrice: parseFloat(minPrice?.toString() || ''),
    maxPrice: parseFloat(maxPrice?.toString() || ''),
    sortBy: sortBy?.toString(),
    sortOrder: sortOrder?.toString() as 'asc' | 'desc',
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products retrieved successfully',
    data: products,
  });
});


const getProductById = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.getProductById(req.params.id);

  if (!product) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Product not found',
      data: null,
    });
    return;
  }

  sendResponse<IProduct>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product retrieved successfully',
    data: product,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const productData: Partial<IProduct> = req.body;
  const updatedProduct = await productService.updateProduct(id, productData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product updated successfully',
    data: updatedProduct,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedProduct = await productService.deleteProduct(id);

  if (!deletedProduct) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Product not found',
      data: null,
    });
  }

  sendResponse<IProduct>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted successfully',
    data: deletedProduct,
  });
});

export const ProductController = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
