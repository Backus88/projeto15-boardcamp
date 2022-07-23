import gameSchema from '../schemas/gamesSchema.js';

export default function validateGame (req, res ,next){
  const validation =gameSchema.validate(req.body);
  if (validation.error) {
    return res.sendStatus(400);
  }
  next();
}