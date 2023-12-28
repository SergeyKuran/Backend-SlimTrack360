import { Router } from 'express';
import schema from '../schemas/userSchemas.js';
import { bodyValidator } from '../decorators/bodyValidator.js';
import authController from '../controllers/authController.js';
import authenticate from '../helpers/authenticate.js';
import { pass } from '../middlewares/googleAuthenticate.js';

const router = Router();

router.get(
  '/google',
  pass.authenticate('google', { scope: ['email', 'profile'] }),
);

router.get(
  '/google/callback',
  pass.authenticate('google', { session: false }),
  authController.googleAuth,
);

router.get('/verify/:verificationToken', authController.verify);

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

router.post('/signout', authenticate, authController.signout);

export default router;
