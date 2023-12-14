import { Router } from 'express';
import foodIntakeController from '../controllers/foodIntakeController.js';
import authenticate from '../helpers/authenticate.js';

const router = Router();

router.use(authenticate);

router.post('/food-intake', foodIntakeController.addFood);

export default router;
