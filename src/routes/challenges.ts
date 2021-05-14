import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../config/multer';
import ChallengesController from '../controllers/ChallengesController';
import { verifyAdminJWT } from '../middlewares/verifyAdminJWT';

const routes = Router();

const challengesController = new ChallengesController();

routes.put(
  '/challenges/:id',
  verifyAdminJWT(),
  multer(multerConfig).single('icon'),
  challengesController.edit
);

export default routes;
