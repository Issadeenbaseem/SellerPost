import express from 'express'
import { createList ,userListUpdate,userListFind,userListFinds} from "../controllers/listing.controller.js";
import { userListDeleting } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const route = express.Router();

route.post('/create',createList)
route.delete('/delete/:id',verifyToken,userListDeleting)
route.post('/update/:id',verifyToken,userListUpdate)
route.get('/get/:id',userListFind)
route.get('/get',userListFinds)

export default route;