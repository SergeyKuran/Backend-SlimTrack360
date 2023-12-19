import Joi from 'joi';

export const AddWaterIntakeSchema = Joi.object({
  date: Joi.date().max('now').required(),
  value: Joi.number().default(0),
});

export const getWaterIntakeSchema = Joi.object({
  date: Joi.date().max('now').required(),
});
