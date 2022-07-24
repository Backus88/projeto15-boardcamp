import customerSchema from '../schemas/customersSchema.js';

export default function validateCustomer (req, res ,next){
  const validation = customerSchema.validate(req.body);
  if (validation.error) {
    return res.sendStatus(400);
  }
  next();
}