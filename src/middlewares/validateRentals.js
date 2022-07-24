import rentalSchema from '../schemas/rentalsSchema.js';

export default function validateRental (req, res ,next){
  const validation =rentalSchema.validate(req.body);
  if (validation.error) {
    return res.sendStatus(400);
  }
  next();
}