import { Router } from 'express';
import { ProductController } from './product.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.get('/', ProductController.getProducts);
router.get('/:id', ProductController.getProductById);
router.post('/', auth(USER_ROLE.admin), ProductController.createProduct);
router.put('/:id', auth(USER_ROLE.admin), ProductController.updateProduct);
router.delete('/:id', auth(USER_ROLE.admin), ProductController.deleteProduct);

export const productRouters = router;
