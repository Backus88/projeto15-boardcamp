import { Router } from 'express';
import { getCategories, insertCategories } from '../controllers/categoryController.js';

const categoryRouter = Router();

categoryRouter.get('/categories', getCategories);
categoryRouter.post('/categories', insertCategories);

export default categoryRouter;