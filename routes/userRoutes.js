import { Router } from 'express';
import userController from '../controllers/userController.js';
import authenticate from '../helpers/authenticate.js';

const router = Router();

router.get('/current', authenticate, userController.current);

router.put('/update', authenticate, userController.update);

router.put('/goal', authenticate, userController.goal);

router.post('/weight', authenticate, userController.weight);

export default router;
