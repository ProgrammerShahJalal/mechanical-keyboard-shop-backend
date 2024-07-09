import { Router } from 'express';
import { productRouters } from '../modules/product/product.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/products',
    route: productRouters,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
