import { Router } from 'express';
import usersRoutes from './users';
import authRoutes from './auth';
import superUsersRoutes from './superUsers';

const routes = Router();

routes.use(usersRoutes);
routes.use(authRoutes);
routes.use(superUsersRoutes);

export default routes;
