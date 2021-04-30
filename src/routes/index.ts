import { Router } from 'express';
import usersRoutes from './users';
import authRoutes from './auth';

const routes = Router();

routes.use(usersRoutes);
routes.use(authRoutes);

export default routes;
