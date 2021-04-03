import { Request, Response } from 'express';

class UsersController {
  async create(request: Request, response: Response) {
    const user = {};

    return response.status(201).json(user);
  }
}

export default UsersController;
