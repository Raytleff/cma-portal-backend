import { Request, Response } from "express";
import { LedgerType } from "@prisma/client";
import * as driverLedgerService from "../service/driverLedgerService";

export const addLedgerEntry = async (req: Request, res: Response) => {
  try {
    const { driverId, type, amount, remarks } = req.body;

    // Basic validation
    if (!driverId || !type || amount === undefined) {
      return res.status(400).json({
        message: "driverId, type, and amount are required",
      });
    }

    if (!Object.values(LedgerType).includes(type)) {
      return res.status(400).json({
        message: "Invalid ledger type",
      });
    }

    const ledger = await driverLedgerService.addLedgerEntry(
      driverId,
      type,
      Number(amount),
      remarks
    );

    res.status(201).json(ledger);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({
      message: err.message || "Failed to add ledger entry",
    });
  }
};
