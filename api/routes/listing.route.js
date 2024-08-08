import express from 'express'
import { createList } from "../controllers/listing.controller.js";
import { userListDeleting } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const route = express.Router();

route.post('/create',createList)
route.delete('/delete/:id',verifyToken,userListDeleting)

export default route;