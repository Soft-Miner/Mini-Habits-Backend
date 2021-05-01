import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';

import { AppError } from '../errors/AppError';
import UsersService from '../services/UsersService';

class UsersController {
  async create(request: Request, response: Response, _next: NextFunction) {
    const { name, lastname, email, password } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
      lastname: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().required(),
    });

    try {
      await schema.validate(request.body);
    } catch (error) {
      return _next(new AppError('Something wrong with the request.'));
    }

    try {
      const user = await new UsersService().create(
        name,
        lastname,
        email,
        password
      );

      return response.status(201).json({
        message: 'User successfully created.',
        user: {
          id: user.id,
          name: user.name,
          lastname: user.lastname,
          email_to_verify: user.email_to_verify,
          created_at: user.created_at,
        },
      });
    } catch (error) {
      return _next(error);
    }
  }

  async requestNewPassword(
    request: Request,
    response: Response,
    _next: NextFunction
  ) {
    const { email } = request.body;

    const schema = yup.object().shape({
      email: yup.string().email().required(),
    });

    try {
      await schema.validate(request.body);
    } catch (error) {
      return _next(new AppError('Invalid email.'));
    }

    try {
      await new UsersService().requestNewPassword(email);

      return response.status(200).json({
        message: `Password recovery email sent to ${email}.`,
      });
    } catch (error) {
      return _next(error);
    }
  }

  async verifyEmail(request: Request, response: Response, _next: NextFunction) {
    const { token } = request.body;

    if (!token) {
      return _next(new AppError('Invalid token.', 401));
    }

    try {
      await new UsersService().verifyEmail(token);

      return response.status(200).json({
        message: 'Email successfully verified.',
      });
    } catch (error) {
      return _next(error);
    }
  }

  async newPassword(request: Request, response: Response, _next: NextFunction) {
    const { requestId, requestSecret, password } = request.body;

    const schema = yup.object().shape({
      requestId: yup.string().required(),
      requestSecret: yup.string().required(),
      password: yup.string().required(),
    });

    try {
      await schema.validate(request.body);
    } catch (error) {
      return _next(
        new AppError('requestId, requestSecret and password are required.')
      );
    }

    try {
      await new UsersService().newPassword(requestId, requestSecret, password);

      return response.status(200).json({
        message: 'Password successfully updated.',
      });
    } catch (error) {
      return _next(error);
    }
  }
}

export default UsersController;
