import { Router } from 'express';
import * as driverController from '../controller/driverController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/driver/me', protect, driverController.getCurrentDriver)

// Admin
router.post('/createDriver', driverController.createDriver);
router.get('/getDrivers', driverController.getDrivers);
router.get('/driver/:id', driverController.getDriver);
router.delete('/driver/:id', driverController.deleteDriver);

// User
router.put('/driver/me', protect, driverController.updateDriver);

// Shared
router.get('/driver/:id/balance', driverController.getDriverBalance);

export default router;