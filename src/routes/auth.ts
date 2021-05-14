import { Router } from 'express';
import AuthController from '../controllers/AuthController';

const routes = Router();

const authController = new AuthController();

routes.post('/authenticate', authController.authenticate);

export default routes;
