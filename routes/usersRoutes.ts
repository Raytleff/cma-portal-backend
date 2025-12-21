import express from 'express';
import {
  userLogin,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  refreshToken
} from '../controller/usersContrroller';
import { protect } from '../middleware/authMiddleware';
import loginLimiter from '../middleware/limiterMiddleware';

const router = express.Router();

router.post("/loginUser", loginLimiter, userLogin);
router.get("/refreshToken", refreshToken)
router.get("/allUsers", protect, getUsers);
router.get("/userById/:id", protect, getUserById);
router.post("/createUser", createUser);
router.put("/updateUser/:id", protect, updateUser);
router.delete("/deleteUser/:id", protect, deleteUser);

export default router