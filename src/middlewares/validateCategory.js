import categorySchema from '../schemas/categoriesSchema.js';

export default function validateCategory (req, res ,next){
  const validation = categorySchema.validate(req.body);
  if (validation.error) {
    return res.sendStatus(400);
  }
  next();
}