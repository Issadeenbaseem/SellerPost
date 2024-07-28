import express from 'express'
import { signUp } from '../controllers/auth.controller.js';

const route = express.Router();

route.post('/sign-up',signUp);

export default route