import Joi from 'joi';

// const errorMessages = {
//   // 'string.base': '{#label} must be a string',
//   // 'string.empty': '{#label} cannot be empty',
// };

export const AddWaterIntakeSchema = Joi.object({
  date: Joi.date().max('now').required(),
  value: Joi.number().optional(),
});

export const getWaterIntakeSchema = Joi.object({
  date: Joi.date().max('now').required(),
});
