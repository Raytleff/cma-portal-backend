import express from 'express';
import {
  getRoles,
  createRole,
  deleteRole

} from '../controller/rolesController';
import { protect } from '../middleware/authMiddleware';
import { get } from 'node:http';

const router = express.Router();

router.get("/getAllRoles", protect,getRoles);
router.post("/createRole",protect, createRole);
router.delete("/deleteRole/:id", protect, deleteRole);


export default router