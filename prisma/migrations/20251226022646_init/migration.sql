/*
  Warnings:

  - You are about to drop the column `name` on the `ddm_tbl_driverInfo` table. All the data in the column will be lost.
  - Added the required column `fullname` to the `ddm_tbl_driverInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ddm_tbl_driverInfo" DROP COLUMN "name",
ADD COLUMN     "fullname" TEXT NOT NULL;
