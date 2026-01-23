import express from 'express';
const router = express.Router();

import userController from '../controllers/userController.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

router.get('/user',protect,authorize('admin'),  userController.getUser);
router.get('/user/:id', userController.getUserById);
router.delete('/user/:id', userController.deleteUser);
router.put('/user/:id', userController.updateUser);


export default router;
