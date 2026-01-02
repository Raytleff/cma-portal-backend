import prisma from '../config/prisma';
import { CreateDriverDto, UpdateDriverDto } from '../types/driver';


// Create Driver Information For Update in Accounts Tab
export const createDriver = async (data: CreateDriverDto) => {
    const user = await prisma.udm_tbl_users.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const driver = await prisma.ddm_tbl_driverInfo.create({
      data: {
        userId: data.userId,
        fullname: user.fullname || "",
        callSign: data.callSign,
        address: data.address,
        contactNumber: data.contactNumber,
        carAssignment: data.carAssignment,
        spouseName: data.spouseName,
        spouseContact: data.spouseContact,
        sssNumber: data.sssNumber,
        philhealthNumber: data.philhealthNumber,
        pagibigNumber: data.pagibigNumber,
        licenseImageUrl: data.licenseImageUrl,
        licenseNumber: data.licenseNumber,
        licenseExpiry: data.licenseExpiry
      }
    });

    return driver;
};

// GET ALL DRIVERS
export const getAllDrivers = async () => {
    return prisma.ddm_tbl_driverInfo.findMany({
        include: {
            apprehensions: true,
            ledgers: true,
            contributions: true
        }
    });
}

// GET DRIVER BY ID
export const getDriverById = async (id: string) => {
  return prisma.ddm_tbl_driverInfo.findUnique({
    where: { id },
    include: {
      apprehensions: true,
      ledgers: true,
    },
  });
};

// GET DRIVER BY USER ID
export const getDriverByUserId = async (userId: string) => {
  return prisma.ddm_tbl_driverInfo.findFirst({
    where: { userId },
    include: {
      apprehensions: true,
      ledgers: true,
      contributions: true
    },
  });
};

// UPDATE DRIVER
export const updateDriver = async (id: string, data: any) => {
  const cleanData = {
    fullname: data.fullname,
    callSign: data.callSign,
    address: data.address,
    contactNumber: data.contactNumber,
    carAssignment: data.carAssignment,
    spouseName: data.spouseName,
    spouseContact: data.spouseContact,
    sssNumber: data.sssNumber,
    philhealthNumber: data.philhealthNumber,
    pagibigNumber: data.pagibigNumber,
    licenseNumber: data.licenseNumber,
    licenseExpiry: data.licenseExpiry,
  }

  return prisma.ddm_tbl_driverInfo.update({
    where: { userId: id },
    data: cleanData,
  })
}

// DELETE DRIVER
export const deleteDriver = async (id: string) => {
  return prisma.ddm_tbl_driverInfo.delete({ where: { id } });
};

// DRIVER BALANCE (CREDIT - DEBIT)
export const getDriverBalance = async (driverId: string) => {
  const ledgers = await prisma.ddm_tbl_driverLedgers.findMany({
    where: { driverId },
  });

  let balance = 0;
  ledgers.forEach(l => {
    if (l.type === "CREDIT") balance -= Number(l.amount);
    else balance += Number(l.amount);
  });

  return balance;
};