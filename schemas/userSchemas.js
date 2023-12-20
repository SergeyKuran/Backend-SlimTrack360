import Joi from 'joi';
import { emailRegexp, passwordRegExp } from '../constans/userConstants.js';

const registration = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.pattern.base': 'Email format should be - example@example.com',
  }),
  password: Joi.string().pattern(passwordRegExp).required().messages({
    'string.pattern.base':
      'Password should be at least 6 symbols and contain at least one capital letter, one lowercase letter, and one special character.',
  }),
  goal: Joi.string().required(),
  sex: Joi.string().required(),
  age: Joi.number().required(),
  height: Joi.number().required(),
  currentWeight: Joi.number().required(),
  levelActivity: Joi.number().required(),
});

const login = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.pattern.base': 'Email format should be - example@example.com',
  }),
  password: Joi.string().required().messages({
    'string.pattern.base':
      'Password should be at least 6 symbols and contain at least one capital letter, one lowercase letter, and one special character.',
  }),
});

const passwordReset = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.pattern.base': 'Email format should be - example@example.com',
  }),
});

const current = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  avatarUrl: Joi.string(),
  age: Joi.number(),
  height: Joi.number(),
  currentWeight: Joi.number(),
});

const update = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  avatarUrl: Joi.string(),
  sex: Joi.string(),
  goal: Joi.string(),
  age: Joi.number(),
  height: Joi.number(),
  currentWeight: Joi.number(),
  date: Joi.date().max('now').optional(),
});

const goal = Joi.object({
  goal: Joi.string().required(),
});

const weight = Joi.object({
  currentWeight: Joi.number().required(),
  date: Joi.date().max('now').optional(),
});

const schema = {
  registration,
  login,
  passwordReset,
  update,
  goal,
  weight,
  current,
};

export default schema;
