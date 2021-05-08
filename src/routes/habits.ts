import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../config/multer';
import HabitsController from '../controllers/HabitsController';

const routes = Router();

const habitsController = new HabitsController();

routes.post(
  '/habits',
  multer(multerConfig).fields([
    { name: 'icon', maxCount: 1 },
    { name: 'challengesIcons', maxCount: 20 },
  ]),
  habitsController.create
);

export default routes;
