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

export const getRoles = asyncHandler(async (_req: Request, res: Response) => {
  try {
    const roles = await prisma.udm_tbl_roles.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    res.status(200).json({ data: roles });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}); 

export const roleById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const role = await prisma.udm_tbl_roles.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        created_at: true
      }
    });

    if (role) {
      return res.status(200).json({msg: "OK", data: role});
    }

    res.status(404).json({ msg: "Not Found" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export const createRole = asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Role name is required" });
  }

  const existingRole = await prisma.udm_tbl_roles.findFirst({
    where: { name },
  });

  if (existingRole) {
    return res.status(409).json({ message: "Role name already taken" });
  }

  const id = uuidv4();

  const newRole = await prisma.udm_tbl_roles.create({
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
    message: "Role created successfully",
    token: accessToken,
    data: newRole,
  });
});

export const updateRole = asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const { id } = req.params;

  try {
  
    const updateRole = await prisma.udm_tbl_roles.update({
      where: { id },
      data: {
        name,
        description: description || "",
      },
    });

    return res.status(200).json({ msg: "OK", data: updateRole });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export const deleteRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedRole = await prisma.udm_tbl_roles.delete({
      where: { id },
    });

    return res.status(200).json({ msg: "OK", data: deletedRole });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


