import express from 'express';
import { userUpdate,userDelete,userListings,getListingOwner} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();
router.post('/update/:id',verifyToken,userUpdate)
router.delete('/delete/:id', verifyToken, userDelete)
router.get('/userListings/:id',verifyToken,userListings)
router.get('/:id',verifyToken,getListingOwner)

export default router;