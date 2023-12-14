import Joi from 'joi';

const foodIntakeSchema = Joi.object({
  date: Joi.string().required,
  breackfast: Joi.object({
    products: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        name: Joi.string().required(),
        calories: Joi.number().required(),
        fat: Joi.number().required(),
        carbonohidretes: Joi.number().required(),
        protein: Joi.number().required(),
      }),
    ),
  }).optional(),
  lunch: Joi.object({
    products: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        name: Joi.string().required(),
        calories: Joi.number().required(),
        fat: Joi.number().required(),
        carbonohidretes: Joi.number().required(),
        protein: Joi.number().required(),
      }),
    ),
  }).optional(),
  dinner: Joi.object({
    products: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        name: Joi.string().required(),
        calories: Joi.number().required(),
        fat: Joi.number().required(),
        carbonohidretes: Joi.number().required(),
        protein: Joi.number().required(),
      }),
    ),
  }).optional(),
  snack: Joi.object({
    products: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        name: Joi.string().required(),
        calories: Joi.number().required(),
        fat: Joi.number().required(),
        carbonohidretes: Joi.number().required(),
        protein: Joi.number().required(),
      }),
    ),
  }).optional(),
});
