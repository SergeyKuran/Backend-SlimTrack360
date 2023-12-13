import Joi from 'joi';
import { emailRegexp, passwordRegExp } from '../constans/user-constants.js';

const registrationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.pattern.base': 'Email format should be - example@example.com',
  }),
  password: Joi.string().pattern(passwordRegExp).required().messages({
    'string.pattern.base':
      'Password should be at least 6 symbols and contain one capital letter and one special character',
  }),
});

export default {
  registrationSchema,
};
