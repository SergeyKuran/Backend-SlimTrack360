import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import { HttpError } from '../helpers/Error/HttpError.js';
import { sendEmail } from '../helpers/sendFromPost.js';
import authServices from '../services/authServices.js';

const { BASE_URL } = process.env;

const signUp = async (req, res, next) => {
  const newUser = await authServices.signUp(req.body);
  res.json({ newUser, message: 'Created' });
};

const signIn = async (req, res, next) => {
  const token = await authServices.signIn(req.body);

  res.json({ token, message: 'Login successful' });
};

const passwordForgot = async (req, res, next) => {
  const password = await authServices.passwordReset(
    req.body.email,
    req.user._id,
  );
  if (!password) throw HttpError(400, 'Sorry, user not found');

  const { email } = req.body;

  const forgotPassword = {
    to: `${email}`,
    subject: 'Reset password!',
    text: `You new password: ${password}! Please login again!`,
  };

  await sendEmail(forgotPassword);

  res.json({ message: 'New password send on your email' });
};

const signout = async (req, res, next) => {
  authServices.logout(req.user._id);

  res.json({ message: 'Logout successful' });
};

const verify = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await authServices.verifyEmail(verificationToken);

  if (!user) throw HttpError(404, 'User not found');

  res.redirect(`${BASE_URL}api/auth/signin`);
};

export default {
  signup: ctrlWrapper(signUp),
  signin: ctrlWrapper(signIn),
  passwordForgot: ctrlWrapper(passwordForgot),
  signout: ctrlWrapper(signout),
  verify: ctrlWrapper(verify),
};
