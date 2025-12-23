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

    res.status(200).json({ msg: "OK", data: roles });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
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

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { id } = req.params;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await prisma.udm_tbl_users.update({
      where: { id },
      data: {
        email,
        password: hashedPassword,
      },
    });

    return res.status(200).json({ msg: "OK", data: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedUser = await prisma.udm_tbl_users.delete({
      where: { id },
    });

    return res.status(200).json({ msg: "OK", data: deletedUser });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


