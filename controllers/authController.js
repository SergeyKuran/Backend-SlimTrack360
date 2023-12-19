import { format } from 'date-fns';
import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import { HttpError } from '../helpers/Error/HttpError.js';
import { sendEmail } from '../helpers/sendFromPost.js';
import { UserWeight } from '../models/userWeight.js';
import authServices from '../services/authServices.js';

const signUp = async (req, res) => {
  const newUser = await authServices.signUp(req.body);

  // ------ Add weight in userWeight Model ----- //
  const { _id: owner, currentWeight } = newUser;
  const formattedDate = format(new Date(), 'yyyy-MM-dd');

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  const userWeight = await UserWeight.findOne({ owner });

  if (!userWeight) {
    const newUserWeight = new UserWeight({
      owner,
      [currentMonth]: [{ date: formattedDate, weight: currentWeight }],
    });

    await newUserWeight.save();
  } else {
    userWeight[currentMonth].push({
      date: formattedDate,
      weight: currentWeight,
    });
    await userWeight.save();
  }

  res.json({ newUser, message: 'Created' });
};

const signIn = async (req, res) => {
  const token = await authServices.signIn(req.body);

  res.json({ token, message: 'Login successful' });
};

const passwordForgot = async (req, res) => {
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

const signout = async (req, res) => {
  authServices.logout(req.user._id);

  res.json({ message: 'Logout successful' });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;

  const {
    name,
    email,
    avatarUrl,
    sex,
    age,
    height,
    verify,
    token,
    currentWeight,
    dailyGoalCalories,
    dailyGoalWater,
    dailyGoalElements,
  } = await authServices.verifyEmail(verificationToken);

  res.json({
    name,
    email,
    avatarUrl,
    sex,
    age,
    verify,
    token,
    height,
    currentWeight,
    dailyGoalCalories,
    dailyGoalWater,
    dailyGoalElements,
  });
};

export default {
  signup: ctrlWrapper(signUp),
  signin: ctrlWrapper(signIn),
  passwordForgot: ctrlWrapper(passwordForgot),
  signout: ctrlWrapper(signout),
  verify: ctrlWrapper(verify),
};
