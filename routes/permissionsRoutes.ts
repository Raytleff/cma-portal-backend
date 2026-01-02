import express from 'express';
import {
createPermission,
getPermissions,
deletePermission,
getPermissionById,
editPermission

} from '../controller/permissionController';
import { protect } from '../middleware/authMiddleware';
import { get } from 'node:http';

const router = express.Router();

router.post("/createPermission", protect,createPermission);
router.get("/getAllPermissions", protect,getPermissions);
router.delete("/deletePermission/:id", protect, deletePermission);
router.put("/editPermission/:id", protect, editPermission);
router.get("/permissionById/:id", protect, getPermissionById);


export default router