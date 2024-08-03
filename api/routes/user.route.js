import express from 'express';
import { userUpdate } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/update/:id',verifyToken,userUpdate)
export default router;