import { Request, Response, Router } from 'express';
import UsersController from './controllers/UsersController';

const routes = Router();

const usersController = new UsersController();

routes.post('/api/users', usersController.create);

routes.get('/api/team', (request: Request, response: Response) => {
  response.json([
    {
      name: 'Carla',
      role: 'Designer',
    },
    {
      name: 'Maroni',
      role: 'Developer',
    },
    {
      name: 'Rodrigo',
      role: 'Developer',
    },
    {
      name: 'Vitor',
      role: 'Developer',
    },
  ]);
});

export default routes;
