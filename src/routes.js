import { Router } from 'express';

import FinanceController from './app/controllers/FinanceController';

const routes = new Router();

routes.get('/finance', FinanceController.index);

export default routes;