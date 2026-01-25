import prisma from "../config/prisma";

// CREATE APPREHENSION
export const createApprehension = async (
  driverId: string,
  violationType: string,
  ticketExpiry: Date
) => {
  // Ensure driver exists
  const driver = await prisma.ddm_tbl_driverInfo.findUnique({
    where: { id: driverId },
  });

  if (!driver) {
    throw new Error("Driver not found");
  }

  return prisma.ddm_tbl_driverApprehension.create({
    data: {
      driverId,
      violationType,
      ticketExpiry,
    },
  });
};

// GET APPREHENSIONS BY DRIVER
export const getDriverApprehensions = async (driverId: string) => {
  return prisma.ddm_tbl_driverApprehension.findMany({
    where: { driverId },
    orderBy: { created_at: "desc" },
  });
};

// UPDATE APPREHENSION (Hold / Release)
export const updateApprehensionStatus = async (
  apprehensionId: string,
  isHeld: boolean
) => {
  return prisma.ddm_tbl_driverApprehension.update({
    where: { id: apprehensionId },
    data: { isHeld },
  });
};

// DELETE APPREHENSION
export const deleteApprehension = async (id: string) => {
  return prisma.ddm_tbl_driverApprehension.delete({
    where: { id },
  });
};