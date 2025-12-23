import express from 'express';
import {
  getRoles,
  createRole

} from '../controller/rolesController';
import { protect } from '../middleware/authMiddleware';
import { get } from 'node:http';

const router = express.Router();

router.get("/getAllRoles", getRoles);
router.post("/createRole", createRole);

export default router