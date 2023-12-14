import { User } from '../models/user.js';
import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import { HttpError } from '../helpers/Error/HttpError.js';
import authServices from '../services/auth-services.js';
import userServices from '../services/user-services.js';

const current = async (req, res, next) => {
  const user = await userServices.currentUser(req.user);
};

export default {
  current: ctrlWrapper(current),
};
