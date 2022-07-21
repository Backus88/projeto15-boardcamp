import { Router } from 'express';
import { getCategorys } from '../controllers/categoryController.js';

const categoryRouter = Router();

categoryRouter.get('/categories', getCategorys);

export default categoryRouter;