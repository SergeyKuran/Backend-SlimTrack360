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

router.put(
  '/food-intake/:id',
  bodyValidator(FoodIntakeSchema.UpdateFoodIntakeSchema),
  foodIntakeController.updateFood,
);

router.delete(
  '/food-intake/',
  bodyValidator(FoodIntakeSchema.DeleteFoodIntakeSchema),
  foodIntakeController.deleteFood,
);

export default router;
