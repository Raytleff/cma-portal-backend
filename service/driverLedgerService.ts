import { PrismaClient, LedgerType } from "@prisma/client";

const prisma = new PrismaClient();

// ADD DEPOSIT / CHARGE
export const addLedgerEntry = async (
  driverId: string,
  type: LedgerType,
  amount: number,
  remarks?: string
) => {
  return prisma.ddm_tbl_driverLedgers.create({
    data: {
      driverId,
      type,
      amount,
      remarks,
    },
  });
};