import { Router } from 'express';
import { insertRent } from '../controllers/rentalsController.js';
import validateRental from '../middlewares/validateRentals.js';

const rentalRouter = Router();
rentalRouter.post('/rentals',validateRental, insertRent);

export default rentalRouter;