import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError';

interface tokenPayload {
  id: string;
}

export const verifyJWT = () => {
  return (request: Request, response: Response, _next: NextFunction) => {
    const token = request.headers['x-access-token'] as string;

    if (!token) throw new AppError('Invalid token.', 401);

    jwt.verify(token, process.env.JWT_SECRET as string, (error, decoded) => {
      if (error) throw new AppError('Invalid token.', 401);

      if (decoded) {
        request.userId = (decoded as tokenPayload).id;
      }

      return _next();
    });
  };
};
