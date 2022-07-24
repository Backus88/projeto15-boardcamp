import { Router } from 'express';
import categoryRouter from './categoryRoutes.js';
import gameRouter from './gameRoutes.js';
import customersRouter from './customersRoutes.js';
import rentalRouter from './rentalsRoutes.js';


const router = Router();
router.use(categoryRouter);
router.use(gameRouter);
router.use(customersRouter);
router.use(rentalRouter);

export default router;