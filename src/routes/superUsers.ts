import { Router } from 'express';
import SuperUsersController from '../controllers/SuperUsersController';

const routes = Router();

const superUsersController = new SuperUsersController();

routes.post('/super_users/authenticate', superUsersController.authenticate);
routes.post('/super_users/refresh_token', superUsersController.refreshToken);

export default routes;
