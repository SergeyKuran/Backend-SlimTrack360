import { Router } from 'express';
import foodIntakeController from '../controllers/foodIntakeController.js';
import authenticate from '../helpers/authenticate.js';
import { bodyValidator } from '../decorators/bodyValidator.js';
import FoodIntakeSchema from '../schemas/foodIntakeSchemas.js';

const router = Router();

router.use(authenticate);

router.post(
  '/food-intake',
  bodyValidator(FoodIntakeSchema.FoodIntakeSchema),
  foodIntakeController.addFood,
);

router.delete(
  '/food-intake/',
  bodyValidator(FoodIntakeSchema.FoodIntakeSchema),
  foodIntakeController.deleteFood,
);

export default router;
