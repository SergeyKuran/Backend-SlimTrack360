import { Router } from 'express';
import userController from '../controllers/userController.js';
import authenticate from '../helpers/authenticate.js';

const router = Router();

router.get('/current', authenticate, userController.current);

export default router;
