import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../config/multer';
import HabitsController from '../controllers/HabitsController';
import { verifyAdminJWT } from '../middlewares/verifyAdminJWT';

const routes = Router();

const habitsController = new HabitsController();

routes.post(
  '/habits',
  verifyAdminJWT(),
  multer(multerConfig).fields([
    { name: 'icon', maxCount: 1 },
    { name: 'challengesIcons', maxCount: 20 },
  ]),
  habitsController.create
);

routes.post(
  '/habits/:id/challenges',
  verifyAdminJWT(),
  multer(multerConfig).single('icon'),
  habitsController.addChallenge
);

routes.put(
  '/habits/:id',
  verifyAdminJWT(),
  multer(multerConfig).single('icon'),
  habitsController.edit
);

routes.get('/habits', verifyAdminJWT(), habitsController.getAll);

routes.get('/habits/:id', verifyAdminJWT(), habitsController.getById);

export default routes;
