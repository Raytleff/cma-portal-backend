/*
  Warnings:

  - The primary key for the `udm_tbl_role_permissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `udm_tbl_user_roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `username` on the `udm_tbl_users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `udm_tbl_users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `udm_tbl_users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "udm_tbl_users_username_key";

-- AlterTable
ALTER TABLE "udm_tbl_role_permissions" DROP CONSTRAINT "udm_tbl_role_permissions_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "udm_tbl_role_permissions_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "udm_tbl_role_permissions_id_seq";

-- AlterTable
ALTER TABLE "udm_tbl_user_roles" DROP CONSTRAINT "udm_tbl_user_roles_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "udm_tbl_user_roles_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "udm_tbl_user_roles_id_seq";

-- AlterTable
ALTER TABLE "udm_tbl_users" DROP COLUMN "username",
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "udm_tbl_users_email_key" ON "udm_tbl_users"("email");
