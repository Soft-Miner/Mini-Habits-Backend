import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';
import SuperUsersService from '../services/SuperUsersService';

class SuperUsersController {
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
      const {
        access_token,
        refresh_token,
      } = await new SuperUsersService().authenticate(email, password);

      return response.status(200).json({
        access_token,
        refresh_token,
      });
    } catch (error) {
      return _next(error);
    }
  }

  async refreshToken(
    request: Request,
    response: Response,
    _next: NextFunction
  ) {
    const { refresh_token } = request.body;

    const schema = yup.object().shape({
      refresh_token: yup.string().required(),
    });

    try {
      await schema.validate(request.body);
    } catch (error) {
      return _next(new AppError('Invalid refresh_token.'));
    }

    try {
      const {
        access_token,
        refresh_token: new_refresh_token,
      } = await new SuperUsersService().refreshToken(refresh_token);

      return response.status(200).json({
        access_token,
        refresh_token: new_refresh_token,
      });
    } catch (error) {
      return _next(error);
    }
  }
}

export default SuperUsersController;
