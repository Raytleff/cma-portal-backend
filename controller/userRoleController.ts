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


export const create = asyncHandler(async (req: Request, res: Response) => {
  const { userId, roleId } = req.body;

  if (!userId || !roleId) {
    return res.status(400).json({ message: "No data is stored" });
  }

  const existingRole = await prisma.udm_tbl_user_roles.findFirst({
    where: { userId },
  });

  if (existingRole) {
    return res.status(409).json({ message: "User already has a role" });
  }

  const id = uuidv4();

  const newRole = await prisma.udm_tbl_user_roles.create({
    data: {
      id,
      userId,
      roleId,
    },
  });

  const accessToken = generateToken(
    newRole.id,
    newRole.userId,
    newRole.roleId
  );

  return res.status(201).json({
    message: "Role created successfully",
    token: accessToken,
    data: newRole,
  });
});



