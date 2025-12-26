-- CreateEnum
CREATE TYPE "DriverCarAssignment" AS ENUM ('GROUP_A', 'GROUP_B', 'DAILY', 'TRUCK');

-- CreateEnum
CREATE TYPE "DriverStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'LEGAL', 'HOLD_ACTIVE');

-- CreateEnum
CREATE TYPE "LedgerType" AS ENUM ('CREDIT', 'DEBIT');

-- CreateEnum
CREATE TYPE "ContributionType" AS ENUM ('SSS', 'PHILHEALTH', 'PAGIBIG');

-- CreateTable
CREATE TABLE "ddm_tbl_driverInfo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "callSign" TEXT,
    "address" TEXT,
    "contactNumber" TEXT,
    "carAssignment" "DriverCarAssignment" NOT NULL,
    "spouseName" TEXT,
    "spouseContact" TEXT,
    "sssNumber" TEXT,
    "philhealthNumber" TEXT,
    "pagibigNumber" TEXT,
    "licenseImageUrl" TEXT,
    "licenseNumber" TEXT,
    "licenseExpiry" TIMESTAMP(3),
    "status" "DriverStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ddm_tbl_driverInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ddm_tbl_driverApprehension" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "violationType" TEXT NOT NULL,
    "ticketExpiry" TIMESTAMP(3) NOT NULL,
    "isHeld" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ddm_tbl_driverApprehension_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ddm_tbl_driverLedgers" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "type" "LedgerType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ddm_tbl_driverLedgers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ddm_tbl_driverContributions" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "contributionType" "ContributionType" NOT NULL,
    "referenceNo" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ddm_tbl_driverContributions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ddm_tbl_driverInfo_userId_key" ON "ddm_tbl_driverInfo"("userId");

-- AddForeignKey
ALTER TABLE "ddm_tbl_driverApprehension" ADD CONSTRAINT "ddm_tbl_driverApprehension_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "ddm_tbl_driverInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ddm_tbl_driverLedgers" ADD CONSTRAINT "ddm_tbl_driverLedgers_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "ddm_tbl_driverInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ddm_tbl_driverContributions" ADD CONSTRAINT "ddm_tbl_driverContributions_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "ddm_tbl_driverInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
