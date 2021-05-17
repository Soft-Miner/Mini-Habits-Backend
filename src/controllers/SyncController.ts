import { NextFunction, Request, Response } from 'express';
import yup from 'yup';
import { AppError } from '../errors/AppError';
import SyncService from '../services/SyncService';

class SyncController {
  async pullChanges(request: Request, response: Response, _next: NextFunction) {
    const { userId } = request;
    const { lastPulletAt } = request.body;

    const schema = yup.object().shape({
      lastPulletAt: yup.number().optional(),
    });

    try {
      await schema.validate(request.body);
    } catch {
      return _next(new AppError("lastPulletAt's format invalid."));
    }

    try {
      const { changes, currentTime } = await new SyncService().getChanges(
        userId as string,
        lastPulletAt
      );

      response.status(200).json({
        changes,
        currentTime,
      });
    } catch (error) {
      return _next(error);
    }
  }

  async pushChanges(request: Request, response: Response, _next: NextFunction) {
    const { userId } = request;
    const { lastPulletAt, changes } = request.body;

    const schema = yup.object().shape({
      lastPulletAt: yup.number().optional(),
      changes: yup.object(),
    });

    try {
      await schema.validate(request.body);
    } catch {
      return _next(new AppError('Something wrong with the request.'));
    }

    try {
      await new SyncService().applyChanges(
        changes,
        userId as string,
        lastPulletAt
      );

      response.status(200).json({
        message: 'Data successfully synced.',
      });
    } catch (error) {
      return _next(error);
    }
  }
}

export default SyncController;
