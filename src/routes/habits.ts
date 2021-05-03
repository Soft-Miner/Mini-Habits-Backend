import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../config/multer';
import HabitsController from '../controllers/HabitsController';

const routes = Router();

const habitsController = new HabitsController();

routes.post(
  '/habits',
  multer(multerConfig).single('icon'),
  habitsController.create
);

export default routes;
