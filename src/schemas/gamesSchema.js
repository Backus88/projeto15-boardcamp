import joi from 'joi';

const pattern = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png).{0,2000}/;

const gameSchema = joi.object({
  name: joi.string().min(1).required(),
  image: joi.string().pattern(new RegExp(pattern)).required(),
  stockTotal: joi.number().integer().min(1).required(),
  categoryId: joi.number().integer().min(1).required(),
  pricePerDay: joi.number().integer().min(1).required()
});

export default gameSchema;