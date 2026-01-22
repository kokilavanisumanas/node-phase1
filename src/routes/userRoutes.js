import express from 'express';
const router = express.Router();

import userController from '../controllers/userController.js';

router.get('/user', userController.getUser);

export default router;
