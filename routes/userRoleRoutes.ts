import express from 'express';
import {
create

} from '../controller/userRoleController';
import { protect } from '../middleware/authMiddleware';
import { get } from 'node:http';

const router = express.Router();

router.post("/create", protect,create);


export default router