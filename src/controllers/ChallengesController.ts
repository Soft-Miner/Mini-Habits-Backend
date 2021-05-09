import { NextFunction, Request, Response } from 'express';
import ChallengesService from '../services/ChallengesService';

class challengesController {
  async edit(request: Request, response: Response, _next: NextFunction) {
    const { description } = request.body;
    const { id } = request.params;
    const icon = request.file;

    try {
      const challenge = await new ChallengesService().edit(
        id,
        icon ? icon.path : undefined,
        description
      );

      return response.status(200).json({
        message: 'Challenge upatdated.',
        challenge,
      });
    } catch (error) {
      return _next(error);
    }
  }
}

export default challengesController;
