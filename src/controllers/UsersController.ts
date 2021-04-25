import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';

import { AppError } from '../errors/AppError';
import UserService from '../services/UserService';

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
      const user = await new UserService().create(
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
    } catch (err) {
      return _next(err);
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
      await new UserService().requestNewPassword(email);

      return response.status(200).json({
        message: `Password recovery email sent to ${email}.`,
      });
    } catch (err) {
      return _next(err);
    }
  }

  async newPassword(request: Request, response: Response, _next: NextFunction) {
    const { requestSecret, password } = request.body;

    const schema = yup.object().shape({
      requestSecret: yup.string().required(),
      password: yup.string().required(),
    });

    try {
      await schema.validate(request.body);
    } catch (error) {
      return _next(new AppError('requestSecret and password are required.'));
    }

    try {
      await new UserService().newPassword(requestSecret, password);

      return response.status(200).json({
        message: `Password successfully updated.`,
      });
    } catch (err) {
      return _next(err);
    }
  }
}

export default UsersController;
