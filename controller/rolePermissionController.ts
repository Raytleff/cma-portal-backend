import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { generateToken, refreshGenToken } from "../middleware/generateToken";
import dotenv from "dotenv";
import { Request, Response } from "express";
import prisma from "../config/prisma.js";
import supabase from "../config/supabase.js";
import { verifyJwt } from "../middleware/generateToken";
import { resolve } from "node:url";


dotenv.config();


export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  try {
    const rolePermissions = await prisma.udm_tbl_role_permissions.findMany({
      select: {
        roleId: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        permission: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Group by role
    const grouped = rolePermissions.reduce((acc: any, rp) => {
      const existingRole = acc.find((r: any) => r.roleId === rp.roleId);
      if (existingRole) {
        existingRole.permissionName.push(rp.permission.name);
        existingRole.permissionId.push(rp.permission.id);
      } else {
        acc.push({
          roleId: rp.roleId,
          roleName: rp.role.name,
          permissionId: [rp.permission.id],
          permissionName: [rp.permission.name],
        });
      }
      return acc;
    }, []);

    res.status(200).json({ msg: 'OK', data: grouped });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


export const deleteRolePermission = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedRolePermission = await prisma.udm_tbl_role_permissions.delete({
      where: { id },
    });
    res.status(200).json({ message: "Role permission deleted successfully", data: deletedRolePermission });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});


export const updateRolePermission = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { roleId, permissionId } = req.body;
  try {
    const updatedRolePermission = await prisma.udm_tbl_role_permissions.update({
      where: { id },
      data: {
        roleId,
        permissionId,
      },
    });
    res.status(200).json({ message: "Role permission updated successfully", data: updatedRolePermission });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});


export const create = asyncHandler(async (req: Request, res: Response) => {
  const { roleId, permissionId } = req.body;

  if (!roleId || !roleId) {
    return res.status(400).json({ message: "No data is stored" });
  }


  const id = uuidv4();

  const newRolePermission = await prisma.udm_tbl_role_permissions.create({
    data: {
      id,
      permissionId,
      roleId,
    },
  });

  const accessToken = generateToken(
    newRolePermission.id,
    newRolePermission.permissionId,
    newRolePermission.roleId
  );

  return res.status(201).json({
    message: "Role permission created successfully",
    token: accessToken,
    data: newRolePermission,
  });
});


export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;  
  try {
    const rolePermission = await prisma.udm_tbl_role_permissions.findUnique({
      where: { id },
    });
    if (!rolePermission) {
      return res.status(404).json({ message: "Role permission not found" });
    }
    res.status(200).json({ data: rolePermission });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});


