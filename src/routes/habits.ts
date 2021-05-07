import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../config/multer';
import HabitsController from '../controllers/HabitsController';

const routes = Router();

const habitsController = new HabitsController();

interface HabitFiles {
  challengesIcons: Express.Multer.File[];
  icon: Express.Multer.File[];
}

routes.post(
  '/habits',
  multer(multerConfig).fields([
    { name: 'icon', maxCount: 1 },
    { name: 'challengesIcons', maxCount: 20 },
  ]),
  (request, response) => {
    const { icon, challengesIcons } = (request.files as unknown) as HabitFiles;
    console.log('challengesIcons', challengesIcons);
    console.log('icon', icon);
    response.json(request.files);
  }
  // habitsController.create
);

export default routes;
