import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { generateToken, refreshGenToken } from '../middleware/generateToken.js';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import prisma from '../config/prisma.js';
import supabase from '../config/supabase.js';

dotenv.config();

export const userLogin = asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body;
  
    try {
      const user = await prisma.users.findFirst({
        where: { username }
      });
  
      if (!user) {
        return res.status(401).json("Invalid Username or Password");
      }
  
      const validPassword = await bcrypt.compare(password, user.password);
  
      if (!validPassword) {
        return res.status(401).json("Invalid Username or Password");
      }
  
      const jwtToken = generateToken(user.id, user.username, user.dateofbirth, user.status);

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

export const refreshToken = (req: Request, res: Response) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized', cookies });

    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string,
        async (err: any, decoded: any) => {
            if (err) return res.status(403).json({ message: 'Forbidden' });

            const user = await prisma.users.findUnique({
              where: { id: decoded.UserInfo.id }
            });

            if (!user) return res.status(401).json({ message: 'Unauthorized' });

            const jwtToken = generateToken(user.id, user.username, user.dateofbirth, user.status);
  
            return res.status(200).json({ msg: "Logged in", token: jwtToken });
          
        }
    );
};

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
    try {
        const users = await prisma.users.findMany({
          select: {
            id: true,
            fullname: true,
            username: true,
            dateofbirth: true,
            status: true,
            created_at: true
          }
        });

        res.status(200).json({msg: "OK", data: users});
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


export const getUserById = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await prisma.users.findUnique({
          where: { id },
          select: {
            id: true,
            fullname: true,
            username: true,
            dateofbirth: true,
            status: true,
            created_at: true
          }
        });

        if (user) {
            return res.status(200).json({msg: "OK", data: [user]});
        }

        res.status(404).json({msg: "not found"});
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const { username, password, dateofbirth, status } = req.body;

    try {
        const existingUser = await prisma.users.findFirst({
          where: { username }
        });

        if (existingUser) {
            return res.status(401).json("Oops! Username already taken!");
        }

        const id = uuidv4();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await prisma.users.create({
          data: {
            id,
            username,
            password: hashedPassword,
            dateofbirth,
            status
          }
        });

        const jwtToken = generateToken(
                            newUser.id, 
                            newUser.username, 
                            newUser.dateofbirth, 
                            newUser.status
                            );

        if (newUser) {
            return res.status(201).json({ msg: "OK", message: `New user ${newUser.username} created` , token: jwtToken  });
        }

        return res.status(404).json({ msg: "Not Found" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


export const updateUser = asyncHandler( async(req: Request, res: Response) => {
        const {username, password, dateofbirth } = req.body;
        const { id } = req.params;

        try{
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const updatedUser = await prisma.users.update({
              where: { id },
              data: {
                username,
                password: hashedPassword,
                dateofbirth
              }
            });

            if (updatedUser) {
              res.status(200).json({msg: "OK", data: updatedUser});
            }
            return res.status(404).json({msg: "Not Found"});

        }catch(error){
            res.status(500).json({ error: "Internal Server Error" });
        }
});

export const deleteUser = asyncHandler(async(req: Request, res: Response) => {
    const {id} =  req.params;
    try{
        const deletedUser = await prisma.users.delete({
          where: { id }
        });

        if (deletedUser) {
           return res.status(200).json({msg: "OK", data: deletedUser});
        }
        return res.status(404).json({msg: "Not Found"});
    }catch(error){
        res.status(500).json({ error: "Internal Server Error" });
    }
});