import { Router } from 'express';
import foodIntakeController from '../controllers/foodIntakeController.js';
import authenticate from '../helpers/authenticate.js';
import { bodyValidator } from '../decorators/bodyValidator.js';
import addFoodIntakeSchema from '../schemas/foodIntakeSchemas.js';

const router = Router();

router.use(authenticate);

router.post(
  '/food-intake',
  bodyValidator(addFoodIntakeSchema),
  foodIntakeController.addFood,
);

export default router;
