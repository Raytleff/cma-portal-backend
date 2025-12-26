import { Router } from 'express';
import * as driverController from '../controller/driverController';

const router = Router();

router.post('/createDriver', driverController.createDriver);
router.get('/getDrivers', driverController.getDrivers);
router.get('/driver/:id', driverController.getDriver);
router.put('/driver/:id', driverController.updateDriver);
router.delete('/driver/:id', driverController.deleteDriver);
router.get('/driver/:id/balance', driverController.getDriverBalance);

export default router;