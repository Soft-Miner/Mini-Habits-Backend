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
      const baseUrl = `${request.protocol}://${request.headers.host}`;
      const user = await new UsersService().create(
        name,
        lastname,
        email,
        password,
        baseUrl
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

  async verifyEmail(request: Request, response: Response) {
    const { token } = request.params;

    try {
      await new UsersService().verifyEmail(token);

      return response.redirect(`${process.env.FRONTEND_URL}/email-verificado`);
    } catch (error) {
      const message = encodeURIComponent(error.message);

      return response.redirect(
        `${process.env.FRONTEND_URL}/erro?message=${message}`
      );
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

  async updatePersonalData(
    request: Request,
    response: Response,
    _next: NextFunction
  ) {
    const { name, lastname } = request.body;
    const { userId } = request;

    const validNameFormat =
      typeof name === 'string' || typeof name === 'undefined';
    const validLastnameFormat =
      typeof lastname === 'string' || typeof lastname === 'undefined';

    if (!validNameFormat || !validLastnameFormat) {
      return _next(new AppError('Something wrong with the request.'));
    }

    try {
      const user = await new UsersService().updatePersonalData(
        userId as string,
        name,
        lastname
      );

      return response.status(200).json({
        message: 'User successfully updated.',
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

  async updateEmail(request: Request, response: Response, _next: NextFunction) {
    const { new_email, password } = request.body;
    const { userId } = request;

    const schema = yup.object().shape({
      new_email: yup.string().email().required(),
      password: yup.string().required(),
    });

    try {
      await schema.validate(request.body);
    } catch (error) {
      return _next(new AppError('Something wrong with the request.'));
    }

    try {
      const user = await new UsersService().updateEmail(
        userId as string,
        new_email,
        password
      );

      return response.status(200).json({
        message: 'Please verify the new email.',
        user: {
          id: user.id,
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          email_to_verify: user.email_to_verify,
          created_at: user.created_at,
        },
      });
    } catch (error) {
      return _next(error);
    }
  }

  async updatePassword(
    request: Request,
    response: Response,
    _next: NextFunction
  ) {
    const { password, new_password } = request.body;
    const { userId } = request;

    const schema = yup.object().shape({
      password: yup.string().required(),
      new_password: yup.string().required(),
    });

    try {
      await schema.validate(request.body);
    } catch (error) {
      return _next(new AppError('Something wrong with the request.'));
    }

    try {
      await new UsersService().updatePassword(
        userId as string,
        password,
        new_password
      );

      return response.status(200).json({
        message: 'Password updated.',
      });
    } catch (error) {
      return _next(error);
    }
  }
}

export default UsersController;
