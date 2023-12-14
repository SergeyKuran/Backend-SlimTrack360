import { Router } from 'express';
import userSchemas from '../schemas/userSchemas.js';
import { bodyValidator } from '../decorators/bodyValidator.js';
import authController from '../controllers/authController.js';
import authenticate from '../helpers/authenticate.js';

const router = Router();

router.post(
  '/signup',
  bodyValidator(userSchemas.registrationSchema),
  authController.signup,
);

router.post(
  '/signin',
  bodyValidator(userSchemas.loginSchema),
  authController.signin,
);

router.post('/forgot-password', authenticate);

router.post('/signout', authenticate, authController.signout);

export default router;
