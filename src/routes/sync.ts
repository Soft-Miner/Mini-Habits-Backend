import { Router } from 'express';
import SyncController from '../controllers/SyncController';
import { verifyJWT } from '../middlewares/verifyJWT';

const routes = Router();

const syncController = new SyncController();

routes.post('/push', verifyJWT(), syncController.pushChanges);
routes.post('/pull', verifyJWT(), syncController.pullChanges);

export default routes;
