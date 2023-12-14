import { User } from '../models/user.js';
import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import { HttpError } from '../helpers/Error/HttpError.js';
import authServices from '../services/auth-services.js';

const signUp = async (req, res, next) => {
  const newUser = await authServices.signUp(req.body);

  res.json({ newUser, message: 'Created' });
};

const signIn = async (req, res, next) => {
  const { token } = await authServices.signIn(req.body);

  res.json({ token, message: 'Login successful' });
};

const signout = async (req, res, next) => {
  authServices.logout(req.user._id);

  res.json({ message: 'Logout successful' });
};

const current = async (req, res, next) => {};

export default {
  signup: ctrlWrapper(signUp),
  signin: ctrlWrapper(signIn),
  signout: ctrlWrapper(signout),
  current: ctrlWrapper(current),
};
