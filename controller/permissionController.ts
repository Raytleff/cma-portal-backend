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

export const getPermissions = asyncHandler(async (_req: Request, res: Response) => {
  try {
    const permissions = await prisma.udm_tbl_permissions.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    res.status(200).json({ msg:'ok', data: permissions });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export const getPermissionById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
    try {
        const permission = await prisma.udm_tbl_permissions.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
                created_at: true
            }
        });
        if (permission) {
            return res.status(200).json({msg: "OK", data: permission});
        }
        res.status(404).json({ msg: "Not Found" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }   
});


export const createPermission = asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Role name is required" });
  }

  const existingRole = await prisma.udm_tbl_permissions.findFirst({
    where: { name },
  });

  if (existingRole) {
    return res.status(409).json({ message: "Permission name already taken" });
  }

  const id = uuidv4();

  const newRole = await prisma.udm_tbl_permissions.create({
    data: {
      id,
      name,
      description: description || "",
    },
  });

  const accessToken = generateToken(
    newRole.id,
    newRole.name,
    newRole.description
  );

  return res.status(201).json({
    message: "Permission created successfully",
    token: accessToken,
    data: newRole,
  });
});

export const deletePermission = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletePermission = await prisma.udm_tbl_permissions.delete({
      where: { id }
    });
    

    return res.status(200).json({ msg: "OK", data: deletePermission });

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export const editPermission = asyncHandler(async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const { id } = req.params;
    try {
        const updatePermission = await prisma.udm_tbl_permissions.update({
            where: { id },
            data: {
                name,
                description: description || "",
            },
        });
        return res.status(200).json({ msg: "OK", data: updatePermission });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
