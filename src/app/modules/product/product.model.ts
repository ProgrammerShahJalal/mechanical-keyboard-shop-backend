import { Schema, model } from "mongoose";

const productSchema = new Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  availableQuantity: { type: Number, required: true },
  rating: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Product = model("Product", productSchema);
export default Product;
