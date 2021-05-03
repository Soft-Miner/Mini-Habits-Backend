import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';

class HabitsController {
  async create(request: Request, response: Response, _next: NextFunction) {
    const { path } = request.file;
    const { name } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
    });

    try {
      await schema.validate(request.body);
    } catch (error) {
      return _next(new AppError('name is required.'));
    }

    return response.json({
      name,
      path,
    });
  }
}

export default HabitsController;
