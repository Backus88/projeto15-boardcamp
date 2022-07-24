import { Router } from 'express';
import { listCustomers, listCustomersById, insertCustomer, updateCustomer } from '../controllers/customersController.js';
import validateCustomer from '../middlewares/validateCustomers.js';

const customersRouter = Router();

customersRouter.get('/customers', listCustomers);
customersRouter.get('/customers/:id', listCustomersById);
customersRouter.post('/customers', validateCustomer, insertCustomer);
customersRouter.put('/customers/:id', validateCustomer, updateCustomer);

export default customersRouter;