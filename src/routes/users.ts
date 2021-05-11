import { Router } from 'express';
import UsersController from '../controllers/UsersController';
import { verifyJWT } from '../middlewares/verifyJWT';

const routes = Router();

const usersController = new UsersController();

routes.post('/register', usersController.create);
routes.post('/request-password', usersController.requestNewPassword);
routes.post('/new-password', usersController.newPassword);
routes.post('/verify-email', usersController.verifyEmail);

routes.put(
  '/users/change-password',
  verifyJWT(),
  usersController.updatePassword
);

routes.put('/users/:id/change-email', verifyJWT(), usersController.updateEmail);

routes.put('/users/:id', verifyJWT(), usersController.update);

export default routes;
