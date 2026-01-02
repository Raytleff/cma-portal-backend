import express from 'express';
import {
create,
getAll,
deleteRolePermission,
updateRolePermission,
getById,


} from '../controller/rolePermissionController';
import { protect } from '../middleware/authMiddleware';
import { get } from 'node:http';

const router = express.Router();

router.post("/create", protect,create);
router.get("/getAll", protect,getAll);
router.delete("/delete/:id", protect, deleteRolePermission);
router.put("/update/:id", protect, updateRolePermission);
router.get("/getById" , protect, getById);


export default router