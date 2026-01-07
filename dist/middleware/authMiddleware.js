import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import prisma from '../config/prisma.js';
import dotenv from 'dotenv';
dotenv.config();
export const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await prisma.udm_tbl_users.findUnique({
                where: { id: decoded.UserInfo.id }
            });
            if (user) {
                req.user = user;
                next();
            }
            else {
                res.status(401);
                throw new Error('Not authorized');
            }
        }
        catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized');
        }
    }
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});
