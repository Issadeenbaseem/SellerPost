import express from 'express'
import { signUp ,signIn } from '../controllers/auth.controller.js';

const route = express.Router();

route.post('/sign-up',signUp);
route.post('/sign-in',signIn);

export default route