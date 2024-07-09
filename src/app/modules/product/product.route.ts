import { Router } from "express";
import { ProductController } from "./product.controller";

const router = Router();

router.get("/", ProductController.getProducts);
router.post("/", ProductController.createProduct);
router.get("/:id", ProductController.getProductById);

export const productRouters = router;
