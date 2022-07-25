import { Router } from 'express';
import { insertRent, listRentals, finishRent, deleteRent } from '../controllers/rentalsController.js';
import validateRental from '../middlewares/validateRentals.js';

const rentalRouter = Router();
rentalRouter.post('/rentals',validateRental, insertRent);
rentalRouter.get('/rentals', listRentals);
rentalRouter.post('/rentals/:id/return',finishRent);
rentalRouter.delete('/rentals/:id', deleteRent);

export default rentalRouter;