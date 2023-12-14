import Joi from 'joi';
import { emailRegexp, passwordRegExp } from '../constans/user-constants.js';

const registrationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.pattern.base': 'Email format should be - example@example.com',
  }),
  password: Joi.string().pattern(passwordRegExp).required().messages({
    'string.pattern.base':
      'Password should be at least 6 symbols and contain at least one capital letter, one lowercase letter, and one special character.',
  }),
  goal: Joi.string(),
  sex: Joi.string().required(),
  age: Joi.number().required(),
  height: Joi.number().required(),
  currentWeight: Joi.number().required(),
  levelActivity: Joi.number().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.pattern.base': 'Email format should be - example@example.com',
  }),
  password: Joi.string(),
});

export default {
  registrationSchema,
  loginSchema,
};
