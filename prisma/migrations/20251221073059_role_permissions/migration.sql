-- CreateTable
CREATE TABLE "udm_tbl_users" (
    "id" TEXT NOT NULL,
    "fullname" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "dateofbirth" TIMESTAMP(3),
    "status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "udm_tbl_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "udm_tbl_roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "udm_tbl_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "udm_tbl_user_roles" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "udm_tbl_user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "udm_tbl_permissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "udm_tbl_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "udm_tbl_role_permissions" (
    "id" SERIAL NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "udm_tbl_role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "udm_tbl_users_username_key" ON "udm_tbl_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "udm_tbl_roles_name_key" ON "udm_tbl_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "udm_tbl_user_roles_userId_roleId_key" ON "udm_tbl_user_roles"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "udm_tbl_permissions_name_key" ON "udm_tbl_permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "udm_tbl_role_permissions_roleId_permissionId_key" ON "udm_tbl_role_permissions"("roleId", "permissionId");

-- AddForeignKey
ALTER TABLE "udm_tbl_user_roles" ADD CONSTRAINT "udm_tbl_user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "udm_tbl_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "udm_tbl_user_roles" ADD CONSTRAINT "udm_tbl_user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "udm_tbl_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "udm_tbl_role_permissions" ADD CONSTRAINT "udm_tbl_role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "udm_tbl_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "udm_tbl_role_permissions" ADD CONSTRAINT "udm_tbl_role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "udm_tbl_permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
