import prisma from "../config/prisma.js";

export const getUserRolesAndPermissions = async (userId: string) => {
  const userRoles = await prisma.udm_tbl_user_roles.findMany({
    where: { userId },
    select: { roleId: true },
  });

  if (!userRoles.length) {
    console.log("No roles found for user:", userId);
    return { roles: [], permissions: [] };
  }

  const roles = await prisma.udm_tbl_roles.findMany({
    where: { id: { in: userRoles.map((ur) => ur.roleId) } },
    select: { name: true, id: true },
  });

  if (!roles.length) {
    console.log("No role details found for user:", userId);
    return { roles: [], permissions: [] };
  }

  const roleIds = roles.map((r) => r.id);
  const rolePermissions = await prisma.udm_tbl_role_permissions.findMany({
    where: { roleId: { in: roleIds } },
    select: { permissionId: true },
  });

  if (!rolePermissions.length) {
    console.log("No permissions linked to roles:", roleIds);
    return { roles: roles.map((r) => r.name), permissions: [] };
  }

  const permissions = await prisma.udm_tbl_permissions.findMany({
    where: { id: { in: rolePermissions.map((rp) => rp.permissionId) } },
    select: { name: true },
  });

  return {
    roles: roles.map((r) => r.name),
    permissions: permissions.map((p) => p.name),
  };
};
