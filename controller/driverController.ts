import {Request , Response} from 'express';
import * as driverService from '../service/driverService';

export const createDriver = async (req: Request, res: Response) => {
  try {
    const driver = await driverService.createDriver(req.body);
    res.status(201).json(driver);
  } catch (err: any) {
      console.error("Create Driver Error:", err.message);
      res.status(400).json({
        message: err.message || "Failed to create driver"
      });
    }
};

export const getDrivers = async (_req: Request, res: Response) => {
  try {
    const drivers = await driverService.getAllDrivers();
    res.status(200).json(drivers);
  } catch (err) {
    res.status(400).json({ message: "Failed to retrieve drivers" });
  }
};

export const getDriver = async (req: Request, res: Response) => {
  try {
    const driver = await driverService.getDriverById(req.params.id);
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.status(200).json(driver);
  } catch (err) {
    res.status(400).json({ message: "Failed to retrieve driver" });
  }
};

export const updateDriver = async (req: Request, res: Response) => {
  try {
    const updated = await driverService.updateDriver(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update driver" });
  }
};

export const deleteDriver = async (req: Request, res: Response) => {
  try {
    await driverService.deleteDriver(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: "Failed to delete driver" });
  }
};

export const getDriverBalance = async (req: Request, res: Response) => {
  try {
    const balance = await driverService.getDriverBalance(req.params.id);
    res.status(200).json({ driverId: req.params.id, balance });
  } catch (err) {
    res.status(400).json({ message: "Failed to retrieve driver balance" });
  }
};