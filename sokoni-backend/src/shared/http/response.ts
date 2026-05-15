import type { Response } from 'express';

export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};

export type ApiResponse<T> =
  | { success: true; data: T; meta?: Record<string, unknown> }
  | { success: false; error: ApiError };

export const ok = <T>(res: Response, data: T, meta?: Record<string, unknown>) => {
  const payload: ApiResponse<T> = { success: true, data, meta };
  return res.status(200).json(payload);
};

export const fail = (res: Response, status: number, error: ApiError) => {
  const payload: ApiResponse<never> = { success: false, error };
  return res.status(status).json(payload);
};
