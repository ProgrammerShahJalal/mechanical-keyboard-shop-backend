import { Router } from "express";
import { productRouters } from "../modules/product/product.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: productRouters,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
