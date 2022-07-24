import Joi from 'joi';
import joi_date from '@joi/date';

const joi = Joi.extend(joi_date);

const customerSchema = joi.object({
  name: joi.string().required(),
  phone: joi.string().min(10).max(11).required(),
  cpf: joi.string().length(11).required(),
  birthday: joi.date().format('YYYY-MM-DD')
});

export default customerSchema;