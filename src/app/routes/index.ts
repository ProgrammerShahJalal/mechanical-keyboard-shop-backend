import { Router } from 'express';
import { productRouters } from '../modules/product/product.route';
import { userRouters } from '../modules/user/user.route';
import { cartRouters } from '../modules/cart/cart.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/products',
    route: productRouters,
  },
  {
    path: '/users',
    route: userRouters,
  },
  {
    path: '/cart',
    route: cartRouters,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
