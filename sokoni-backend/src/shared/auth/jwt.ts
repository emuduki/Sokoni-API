import jwt from 'jsonwebtoken';
import type { Role } from '@prisma/client';
import { config } from '../config/index.js';

export type JwtPayload = {
  sub: string;
  email: string;
  role: Role;
};

export const signToken = (payload: JwtPayload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
};
