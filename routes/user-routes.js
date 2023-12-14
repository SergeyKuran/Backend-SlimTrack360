import { Router } from 'express';
import userSchemas from '../schemas/userSchemas.js';
import { bodyValidator } from '../decorators/bodyValidator.js';
import authController from '../controllers/authController.js';
import userController from '../controllers/userController.js';
import authenticate from '../helpers/authenticate.js';

const router = Router();

router.get('/current', authenticate, userController.current);

export default router;
