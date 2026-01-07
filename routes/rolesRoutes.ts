import express from 'express';
import {
  getRoles,
  createRole,
  deleteRole,
  roleById,
  updateRole


} from '../controller/rolesController';
import { protect } from '../middleware/authMiddleware';
import { get } from 'node:http';

const router = express.Router();

router.get("/getAllRoles", protect,getRoles);
router.get("/roleById/:id", protect,roleById);
router.post("/createRole",protect, createRole);
router.delete("/deleteRole/:id", protect, deleteRole);
router.put("/updateRole/:id", protect, updateRole);


export default router