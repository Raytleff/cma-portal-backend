import express from 'express';
import {
  getRoles,
<<<<<<< Updated upstream
  createRole
=======
  createRole,
  deleteRole,
  roleById,
  updateRole
>>>>>>> Stashed changes

} from '../controller/rolesController';
import { protect } from '../middleware/authMiddleware';
import { get } from 'node:http';

const router = express.Router();

<<<<<<< Updated upstream
router.get("/getAllRoles", getRoles);
router.post("/createRole", createRole);
=======
router.get("/getAllRoles", protect,getRoles);
router.get("/roleById/:id", protect,roleById);
router.post("/createRole",protect, createRole);
router.delete("/deleteRole/:id", protect, deleteRole);
router.put("/updateRole/:id", protect, updateRole);

>>>>>>> Stashed changes

export default router