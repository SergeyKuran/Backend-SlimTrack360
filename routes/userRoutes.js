import { Router } from 'express';
import userController from '../controllers/userController.js';
import authenticate from '../helpers/authenticate.js';
import { upload } from '../helpers/uploadFile.js';
import { bodyValidator } from '../decorators/bodyValidator.js';
import schema from '../schemas/userSchemas.js';

const router = Router();

router.get(
  '/current',
  authenticate,
  bodyValidator(schema.current),
  userController.current,
);

router.put(
  '/update',
  authenticate,
  bodyValidator(schema.update),
  upload.single('avatar'),
  userController.update,
);

router.put(
  '/goal',
  authenticate,
  bodyValidator(schema.goal),
  userController.goal,
);

router.post(
  '/weight',
  authenticate,
  bodyValidator(schema.weight),
  userController.weight,
);

export default router;
