import { Router } from 'express';
import UsersController from '../controllers/UsersController';

const routes = Router();

const usersController = new UsersController();

routes.post('/register', usersController.create);
routes.post('/request-password', usersController.requestNewPassword);
routes.post('/new-password', usersController.newPassword);
routes.post('/verify-email', usersController.verifyEmail);

export default routes;
