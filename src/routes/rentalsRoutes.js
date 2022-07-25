import { Router } from 'express';
import { insertRent, listRentals } from '../controllers/rentalsController.js';
import validateRental from '../middlewares/validateRentals.js';

const rentalRouter = Router();
rentalRouter.post('/rentals',validateRental, insertRent);
rentalRouter.get('/rentals', listRentals);

export default rentalRouter;