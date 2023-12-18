import { Router } from 'express';
import authenticate from '../helpers/authenticate.js';
import userStatistics from '../controllers/userStatisticController.js';

const router = Router();

router.use(authenticate);

router.get('/statistics', userStatistics.statistic);

export default router;
