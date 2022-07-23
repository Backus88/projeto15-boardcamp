import { Router } from 'express';
import categoryRouter from './categoryRoutes.js';
import gameRouter from './gameRoutes.js';


const router = Router();
router.use(categoryRouter);
router.use(gameRouter);

export default router;