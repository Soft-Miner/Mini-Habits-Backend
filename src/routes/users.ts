import { Router } from 'express';
import UsersController from '../controllers/UsersController';
import { verifyJWT } from '../middlewares/verifyJWT';

const routes = Router();

const usersController = new UsersController();

routes.post('/register', usersController.create);
routes.post('/request-password', usersController.requestNewPassword);
routes.post('/new-password', usersController.newPassword);

routes.get('/verify-email/:token', usersController.verifyEmail);

routes.put(
  '/users/change-password',
  verifyJWT(),
  usersController.updatePassword
);

routes.put('/users/change-email', verifyJWT(), usersController.updateEmail);

routes.put(
  '/users/personal-data',
  verifyJWT(),
  usersController.updatePersonalData
);

routes.get('/users/personal-data', verifyJWT(), usersController.getById);

export default routes;
