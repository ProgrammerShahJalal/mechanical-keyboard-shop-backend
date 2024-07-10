import Product from './product.model';
import { IProduct } from './product.interface';

interface GetProductsParams {
  search?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const getProducts = async (params: GetProductsParams) => {
  const { search, brand, minPrice, maxPrice, sortBy, sortOrder } = params;
  const query: any = {};

  if (search) {
    query.$or = [
      { name: new RegExp(search, 'i') },
      { brand: new RegExp(search, 'i') },
    ];
  }

  if (brand) {
    query.brand = brand;
  }

  if (minPrice) {
    query.price = { ...query.price, $gte: minPrice };
  }

  if (maxPrice) {
    query.price = { ...query.price, $lte: maxPrice };
  }

  const sort: any = {};
  if (sortBy) {
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  }

  return await Product.find(query).sort(sort);
};

export const createProduct = async (productData: IProduct) => {
  const product = new Product(productData);
  return await product.save();
};

export const getProductById = async (id: string) => {
  return await Product.findById(id);
};

export const updateProduct = async (
  id: string,
  productData: Partial<IProduct>
) => {
  const updatedProduct = await Product.findByIdAndUpdate(id, productData, {
    new: true,
  });
  return updatedProduct;
};

export const deleteProduct = async (id: string) => {
  const deletedProduct = await Product.findByIdAndDelete(id);
  return deletedProduct;
};

export const ProductService = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
