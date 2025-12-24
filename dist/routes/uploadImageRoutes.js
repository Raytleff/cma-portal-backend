import express from 'express';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();
import { uploadProfileImage, updateProfileImage, deleteProfilePic, uploadCoverImage, updateCoverImage, deleteCoverPic } from '../controller/imageController.js';
import { protect } from '../middleware/authMiddleware.js';
router.use(protect);
//For profile picture
router.post("/profilePic/create/:user_id", upload.single('pfp'), uploadProfileImage);
router.put("/profilePic/update/:id", upload.single('pfp'), updateProfileImage);
router.delete("/profilePic/delete/:id", deleteProfilePic);
//For cover picture
router.post("/coverPic/create/:user_id", upload.single('cover'), uploadCoverImage);
router.put("/coverPic/update/:id", upload.single('cover'), updateCoverImage);
router.delete("/coverPic/delete/:id", deleteCoverPic);
export default router;
