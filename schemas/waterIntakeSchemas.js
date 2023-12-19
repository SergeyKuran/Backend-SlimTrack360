import Joi from 'joi';

export const AddWaterIntakeSchema = Joi.object({
  date: Joi.date().max('now').required(),
  value: Joi.number(),
});
