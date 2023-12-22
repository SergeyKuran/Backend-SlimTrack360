import { Router } from 'express';
import authenticate from '../helpers/authenticate.js';
import { bodyValidator } from '../decorators/bodyValidator.js';
import {
  AddWaterIntakeSchema,
  RemoveWaterIntakeSchema,
} from '../schemas/waterIntakeSchemas.js';
import waterIntakeController from '../controllers/waterIntakeController.js';

const router = Router();

router.use(authenticate);

router.post(
  '/water-intake',
  bodyValidator(AddWaterIntakeSchema),
  waterIntakeController.addWater,
);

router.delete(
  '/water-intake',
  bodyValidator(RemoveWaterIntakeSchema),
  waterIntakeController.resetWater,
);

export default router;
