import express from 'express';
import { userUpdate,userDelete } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();
router.post('/update/:id',verifyToken,userUpdate)
router.delete('/delete/:id', verifyToken, userDelete)
export default router;