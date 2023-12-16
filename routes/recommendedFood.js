import { Router } from 'express';
import recommendedFoodController from '../controllers/recommendedFoodСontroller.js';

const router = Router();

router.get('/recommended-food', recommendedFoodController.getAllFood);

export default router;
