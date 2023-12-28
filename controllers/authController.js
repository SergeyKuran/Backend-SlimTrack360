import { format } from 'date-fns';
import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import { documentSucssesfullVerification } from '../helpers/documentSucssesfullVarification.js';
import { HttpError } from '../helpers/Error/HttpError.js';
import { sendEmail } from '../helpers/sendFromPost.js';
import { UserWeight } from '../models/userWeight.js';
import authServices from '../services/authServices.js';

const { BASE_URL } = process.env;

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

  res.status(201).json({ message: 'Created' });
};

// ---------------  Log in ------------------- //
const signIn = async (req, res) => {
  const user = await authServices.signIn(req.body);

  res.status(200).json({ user, message: 'Login successful' });
};

const passwordForgot = async (req, res) => {
  const password = await authServices.passwordReset(req.body.email);
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

  await authServices.verifyEmail(verificationToken);

  res.send(`${documentSucssesfullVerification()}`);
};

const googleAuth = async (req, res) => {
  const { _id: id } = req.user;
  const token = await authServices.google(id);

  res.redirect(
    `https://maksymbora.github.io/team-project-SlimTrack360/main?token=${token}`,
  );
};

export default {
  signup: ctrlWrapper(signUp),
  signin: ctrlWrapper(signIn),
  passwordForgot: ctrlWrapper(passwordForgot),
  signout: ctrlWrapper(signout),
  verify: ctrlWrapper(verify),
  googleAuth: ctrlWrapper(googleAuth),
};
