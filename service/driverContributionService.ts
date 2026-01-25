import { PrismaClient, ContributionType } from "@prisma/client";

const prisma = new PrismaClient();

// ADD DRIVER CONTRIBUTION
export const addDriverContribution = async (
  driverId: string,
  contributionType: ContributionType,
  amount: number,
  referenceNo?: string
) => {
  return prisma.ddm_tbl_driverContributions.create({
    data: {
      driverId,
      contributionType,
      amount,
      referenceNo,
    },
  });
};

// GET CONTRIBUTIONS BY DRIVER
export const getDriverContributions = async (driverId: string) => {
  return prisma.ddm_tbl_driverContributions.findMany({
    where: { driverId },
    orderBy: { created_at: "desc" },
  });
};
