import { Router } from 'express';
import { getCategories, insertCategories } from '../controllers/categoryController.js';
import validateCategory from '../middlewares/validateCategory.js';

const categoryRouter = Router();

categoryRouter.get('/categories', getCategories);
categoryRouter.post('/categories',validateCategory, insertCategories);

export default categoryRouter;