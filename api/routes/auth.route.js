import express from 'express'
import { signUp ,signIn, google, signOut} from '../controllers/auth.controller.js';

const route = express.Router();

route.post('/sign-up',signUp);
route.post('/sign-in',signIn);
route.post('/google',google);
route.get('/signOut',signOut)

export default route