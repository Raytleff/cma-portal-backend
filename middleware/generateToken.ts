import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const generateToken = (id: string, username: string, status: string | null) => {
    return jwt.sign(
        {
            UserInfo: {
                id,
                username,
                status
            }
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
    );
};

export const refreshGenToken = async (id: string) => {
    return jwt.sign(
        {
            UserInfo: {
                id
            }
        },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: '9d' }
    );
};

export const verifyJwt = (token: string, secret: string): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err || !decoded) return reject(err);
      resolve(decoded as JwtPayload);
    });
  });
};