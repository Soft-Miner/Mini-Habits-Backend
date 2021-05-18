import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';
import User from '../models/User';
import AuthService from '../services/AuthService';

class AuthController {
  async authenticate(
    request: Request,
    response: Response,
    _next: NextFunction
  ) {
    const { email, password } = request.body;

    const schema = yup.object().shape({
      email: yup.string().email().required(),
      password: yup.string().required(),
    });

    try {
      await schema.validate(request.body);
    } catch (error) {
      return _next(new AppError('Email or password is incorrect.', 401));
    }

    try {
      const { token, user } = await new AuthService().authenticate(
        email,
        password
      );

      response.status(200).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          created_at: user.created_at,
        },
      });
    } catch (error) {
      return _next(error);
    }
  }
}

export default AuthController;
