import { Router } from 'express';
import userSchemas from '../schemas/userSchemas.js';
import { bodyValidator } from '../decorators/bodyValidator.js';
import authController from '../controllers/authController.js';

const router = Router();

// ------ Sign Up ----------- //

router.post(
  '/signup',
  bodyValidator(userSchemas.registrationSchema),
  authController.signup,
);

export default router;
