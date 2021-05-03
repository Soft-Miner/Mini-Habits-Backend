import { Router } from 'express';
import usersRoutes from './users';
import authRoutes from './auth';
import superUsersRoutes from './superUsers';
import habitsRouter from './habits';

const routes = Router();

routes.use(usersRoutes);
routes.use(authRoutes);
routes.use(superUsersRoutes);
routes.use(habitsRouter);

export default routes;
