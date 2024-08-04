import express from 'express'
import { createList } from "../controllers/listing.controller.js";

const route = express.Router();

route.post('/create',createList)

export default route;