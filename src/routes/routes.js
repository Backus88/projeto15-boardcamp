import { Router } from 'express';
import categoryRouter from './categoryRoutes.js';


const router = Router();
router.use(categoryRouter);


export default router;