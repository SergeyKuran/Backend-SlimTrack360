import { Router } from 'express';
import schema from '../schemas/userSchemas.js';
import { bodyValidator } from '../decorators/bodyValidator.js';
import authController from '../controllers/authController.js';
import authenticate from '../helpers/authenticate.js';

const router = Router();

router.post(
  '/signup',
  bodyValidator(schema.registration),
  authController.signup,
);

router.post('/signin', bodyValidator(schema.login), authController.signin);

router.post(
  '/forgot-password',
  bodyValidator(schema.passwordReset),
  authController.passwordForgot,
);

router.get('/verify/:verificationToken', authController.verify);

router.post('/signout', authenticate, authController.signout);

export default router;
