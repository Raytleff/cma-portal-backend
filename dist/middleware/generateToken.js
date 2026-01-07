import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const generateToken = (id, username, status) => {
    return jwt.sign({
        UserInfo: {
            id,
            username,
            status
        }
    }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
export const refreshGenToken = async (id) => {
    return jwt.sign({
        UserInfo: {
            id
        }
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '9d' });
};
export const verifyJwt = (token, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err || !decoded)
                return reject(err);
            resolve(decoded);
        });
    });
};
