import Product from "./product.model";
import { IProduct } from "./product.interface";

export const getProducts = async () => {
  return await Product.find();
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
