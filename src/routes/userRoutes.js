import express from 'express';
const router = express.Router();

import userController from '../controllers/userController.js';

router.get('/user', userController.getUser);
router.get('/user/:id', userController.getUserById);
router.delete('/user/:id', userController.deleteUser);
router.put('/user/:id', userController.updateUser);

export default router;
