import { Request, Response } from "express";
import { ContributionType } from "@prisma/client";
import * as contributionService from "../service/driverContributionService";

export const addDriverContribution = async (req: Request, res: Response) => {
  try {
    const { driverId, contributionType, amount, referenceNo } = req.body;

    // Validation
    if (!driverId || !contributionType || amount === undefined) {
      return res.status(400).json({
        message: "driverId, contributionType, and amount are required",
      });
    }

    if (!Object.values(ContributionType).includes(contributionType)) {
      return res.status(400).json({
        message: "Invalid contribution type",
      });
    }

    const contribution = await contributionService.addDriverContribution(
      driverId,
      contributionType,
      Number(amount),
      referenceNo
    );

    res.status(201).json(contribution);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({
      message: err.message || "Failed to add driver contribution",
    });
  }
};

export const getDriverContributions = async (req: Request, res: Response) => {
  try {
    const { driverId } = req.params;

    const contributions = await contributionService.getDriverContributions(
      driverId
    );

    res.status(200).json(contributions);
  } catch (err) {
    res.status(400).json({ message: "Failed to retrieve contributions" });
  }
};
