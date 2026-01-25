import { Request, Response } from "express";
import * as apprehensionService from "../service/driverApprehensionService";

// CREATE
export const createApprehension = async (req: Request, res: Response) => {
  try {
    const { driverId, violationType, ticketExpiry } = req.body;

    if (!driverId || !violationType || !ticketExpiry) {
      return res.status(400).json({
        message: "driverId, violationType, and ticketExpiry are required",
      });
    }

    const apprehension = await apprehensionService.createApprehension(
      driverId,
      violationType,
      new Date(ticketExpiry)
    );

    res.status(201).json(apprehension);
  } catch (err: any) {
    res.status(400).json({
      message: err.message || "Failed to create apprehension",
    });
  }
};

// GET BY DRIVER
export const getDriverApprehensions = async (req: Request, res: Response) => {
  try {
    const { driverId } = req.params;

    const apprehensions =
      await apprehensionService.getDriverApprehensions(driverId);

    res.status(200).json(apprehensions);
  } catch (err: any) {
    res.status(400).json({
      message: err.message || "Failed to retrieve apprehensions",
    });
  }
};

// UPDATE HOLD STATUS
export const updateApprehensionStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { isHeld } = req.body;

    if (typeof isHeld !== "boolean") {
      return res.status(400).json({
        message: "isHeld must be boolean",
      });
    }

    const updated =
      await apprehensionService.updateApprehensionStatus(id, isHeld);

    res.status(200).json(updated);
  } catch (err: any) {
    res.status(400).json({
      message: err.message || "Failed to update apprehension",
    });
  }
};

// DELETE
export const deleteApprehension = async (req: Request, res: Response) => {
  try {
    await apprehensionService.deleteApprehension(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({
      message: err.message || "Failed to delete apprehension",
    });
  }
};
