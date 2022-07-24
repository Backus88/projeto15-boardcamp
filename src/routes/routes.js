import { Router } from 'express';
import categoryRouter from './categoryRoutes.js';
import gameRouter from './gameRoutes.js';
import customersRouter from './customersRoutes.js';


const router = Router();
router.use(categoryRouter);
router.use(gameRouter);
router.use(customersRouter);

export default router;