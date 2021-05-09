import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';
import HabitChallenge from '../models/HabitChallenge';
import HabitsService from '../services/HabitsService';

interface HabitFiles {
  challengesIcons?: Express.Multer.File[];
  icon?: Express.Multer.File[];
}

interface Challenge {
  level: number;
  description: string;
  xp_reward: number;
}

class HabitsController {
  async create(request: Request, response: Response, _next: NextFunction) {
    const { name, description, challenges } = request.body;
    const { icon, challengesIcons } = (request.files as unknown) as HabitFiles;

    const schema = yup.object().shape({
      name: yup.string().required(),
      description: yup.string().required(),
      challenges: yup.string().required(),
    });

    try {
      await schema.validate(request.body);
    } catch {
      return _next(new AppError('Something wrong with the request.'));
    }

    let challengesParsed: Challenge[];

    try {
      challengesParsed = JSON.parse(challenges);
    } catch {
      return _next(new AppError('Invalid challenge JSON string.'));
    }

    const schemaChallenges = yup.array().of(
      yup.object().shape({
        level: yup.number().min(0).required(),
        description: yup.string().required(),
        xp_reward: yup.number().positive().required(),
      })
    );

    try {
      await schemaChallenges.validate(challengesParsed);
    } catch {
      return _next(new AppError('Some field is missing in challenges.'));
    }

    if (!icon) {
      return _next(new AppError('icon is required.'));
    }

    if (!challengesIcons) {
      return _next(new AppError('challengesIcon is required.'));
    }
    if (challengesIcons.length !== challengesParsed.length) {
      return _next(
        new AppError('ChallengesIcon and challenges must have the same length.')
      );
    }

    const habitChallenges = challengesParsed.map((challenge, index) => {
      const habitChallenge = new HabitChallenge();
      habitChallenge.icon = challengesIcons[index].path;
      habitChallenge.level = challenge.level;
      habitChallenge.xp_reward = challenge.xp_reward;
      habitChallenge.description = challenge.description;

      return habitChallenge;
    });

    try {
      const habit = await new HabitsService().create(
        name,
        description,
        habitChallenges,
        icon[0].path
      );

      return response.status(201).json({
        message: 'Habit successfully created.',
        habit,
      });
    } catch (error) {
      return _next(error);
    }
  }

  async addChallenge(
    request: Request,
    response: Response,
    _next: NextFunction
  ) {
    const { description, xp_reward, level } = request.body;
    const { id } = request.params;
    const icon = request.file;

    if (!icon) {
      return _next(new AppError('Some field is missing.'));
    }

    const schema = yup.object().shape({
      xp_reward: yup.string().required(),
      description: yup.string().required(),
      level: yup.string().required(),
    });

    try {
      await schema.validate(request.body);
    } catch {
      return _next(new AppError('Some field is missing.'));
    }

    try {
      const challenge = new HabitChallenge();
      challenge.description = description;
      challenge.level = Number(level);
      challenge.xp_reward = Number(xp_reward);
      challenge.icon = icon.path;

      const challengeSaved = await new HabitsService().addChallenge(
        id,
        challenge
      );

      return response.status(201).json({
        message: 'Challenge successfully created.',
        challenge: challengeSaved,
      });
    } catch (error) {
      return _next(error);
    }
  }
}

export default HabitsController;
