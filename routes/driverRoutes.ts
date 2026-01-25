import { Router } from 'express';
import * as driverController from '../controller/driverController';
import * as driverLedgerController from "../controller/driverLedgerController";
import * as contributionController from "../controller/driverContributionController";
import * as apprehensionController from "../controller/driverApprehensionController";
import multer from 'multer';

import { protect } from '../middleware/authMiddleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/driver/me', protect, driverController.getCurrentDriver);   

// Role should be Admin
router.post('/createDriver', driverController.createDriver);
router.post('/driver/:id/license-image', upload.single('image'), driverController.uploadLicenseImage);
router.get('/getDrivers', driverController.getDrivers);
router.get('/driver/:id', driverController.getDriver);
router.delete('/driver/:id', driverController.deleteDriver);
router.get('/driver/:id/balance', driverController.getDriverBalance);


// TODO: FIX ROUTE AND FUNCTION
router.put('/driver/me', protect, driverController.updateDriver);

// Driver Ledger and Contributions - Role should be Admin
router.post("/createLedger", driverLedgerController.addLedgerEntry);
router.post("/createContribution", contributionController.addDriverContribution);
router.get("/driver/:driverId/contributions",contributionController.getDriverContributions);

// Driver Apprehensions - Role should be Admin
router.post("/createApprehension", apprehensionController.createApprehension);
router.get("/driver/:driverId", apprehensionController.getDriverApprehensions);
router.put("/:id/hold", apprehensionController.updateApprehensionStatus);
router.delete("/:id", apprehensionController.deleteApprehension);

export default router;