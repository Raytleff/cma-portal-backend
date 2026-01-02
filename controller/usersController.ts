import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { generateToken, refreshGenToken } from '../middleware/generateToken';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import prisma from '../config/prisma.js';
import { verifyJwt } from '../middleware/generateToken';


dotenv.config();

export const userLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.udm_tbl_users.findFirst({
      where: { email }
    });

    if (!user) {
      return res.status(401).json("Invalid email or Password");
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json("Invalid email or Password");
    }

    const jwtToken = generateToken(user.id, user.email, user.status);
    const refreshToken = await refreshGenToken(user.id);

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 9 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({ msg: "Logged in", token: jwtToken });

  } catch (error) {
    console.error("ERROR OCCURRED: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.jwt || typeof cookies.jwt !== 'string') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  let decoded;
  try {
    decoded = await verifyJwt(
      cookies.jwt,
      process.env.REFRESH_TOKEN_SECRET as string
    );
  } catch {
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return res.status(403).json({ message: 'Forbidden' });
  }

  const userId = (decoded as any).UserInfo?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await prisma.udm_tbl_users.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const accessToken = generateToken(user.id, user.email, user.status,
        user.fullname);

  return res.status(200).json({
    msg: 'Refreshed',
    token: accessToken,
    data: {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      status: user.status,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  });
});





export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  try {
    const users = await prisma.udm_tbl_users.findMany({
      select: {
        id: true,
        fullname: true,
        email: true,
        status: true,
        created_at: true
      }
    });

    res.status(200).json({ msg: "OK", data: users });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.udm_tbl_users.findUnique({
      where: { id },
      select: {
        id: true,
        fullname: true,
        email: true,
        status: true,
        created_at: true
      }
    });

    if (user) {
      return res.status(200).json({ msg: "OK", data: [user] });
    }

    res.status(404).json({ msg: "Not Found" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, status } = req.body;

  const existingUser = await prisma.udm_tbl_users.findFirst({
    where: { email }
  });

  if (existingUser) {
    return res.status(409).json({ message: 'Email already taken' });
  }

  const id = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.udm_tbl_users.create({
    data: {
      id,
      email,
      password: hashedPassword,
      status
    }
  });
  
  const accessToken = generateToken(
    newUser.id,
    newUser.email,
    newUser.status
  );

  const refreshToken = await refreshGenToken(newUser.id);

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: true,       
    sameSite: 'none',
    maxAge: 9 * 24 * 60 * 60 * 1000 // 9 days
  });

  return res.status(201).json({
    msg: 'OK',
    token: accessToken,
    data: {
      id: newUser.id,
      email: newUser.email,
      status: newUser.status
    }
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
        password: hashedPassword
      }
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
      where: { id }
    });

    return res.status(200).json({ msg: "OK", data: deletedUser });

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


export const logoutUser = asyncHandler(async (_req: Request, res: Response) => {
  try {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return res.status(200).json({ msg: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
});
 