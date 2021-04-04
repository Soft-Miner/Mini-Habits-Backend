import { NextFunction, Request, Response } from 'express';
import UserService from '../services/UserService';

class UsersController {
  async create(request: Request, response: Response, _next: NextFunction) {
    const { name } = request.body;

    try {
      const user = await new UserService().create(name);

      return response
        .status(201)
        .json({ messasge: 'User successfully created.', user });
    } catch (err) {
      return _next(err);
    }
  }
}

export default UsersController;
