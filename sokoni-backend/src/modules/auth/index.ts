import { Router } from 'express';
import { z } from 'zod';
import { ok, fail } from '../../shared/http/response.js';
import { validateRequest } from '../../shared/middleware/validateRequest.js';
import { prisma } from '../../shared/db/prisma.js';
import { hashPassword, verifyPassword } from '../../shared/auth/password.js';
import { signToken } from '../../shared/auth/jwt.js';
import { authenticate } from '../../shared/middleware/authenticate.js';
import { authorizeRoles } from '../../shared/middleware/authorizeRole.js';
import type { Role } from '@prisma/client';

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['BUYER', 'VENDOR', 'WHOLESALER', 'ADMIN']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

authRouter.post('/register', validateRequest(registerSchema), async (req, res) => {
  const { email, password, role } = req.body as z.infer<typeof registerSchema>;
  const normalizedEmail = email.toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  });

  if (existing) {
    return fail(res, 409, {
      code: 'EMAIL_IN_USE',
      message: 'Email is already registered',
    });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      role: (role ?? 'BUYER') as Role,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  const token = signToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  return ok(res, { user, token });
});

authRouter.post('/login', validateRequest(loginSchema), async (req, res) => {
  const { email, password } = req.body as z.infer<typeof loginSchema>;
  const normalizedEmail = email.toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    return fail(res, 401, {
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password',
    });
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return fail(res, 401, {
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password',
    });
  }

  const token = signToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  return ok(res, {
    user: { id: user.id, email: user.email, role: user.role },
    token,
  });
});

authRouter.get('/me', authenticate, (req, res) => {
  if (!req.user) {
    return fail(res, 401, {
      code: 'UNAUTHORIZED',
      message: 'Unauthorized',
    });
  }

  return ok(res, { user: req.user });
});

authRouter.get('/admin', authenticate, authorizeRoles(['ADMIN']), (_req, res) => {
  return ok(res, { message: 'Welcome, admin.' });
});
