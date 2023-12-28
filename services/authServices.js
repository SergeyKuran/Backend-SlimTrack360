import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dayNormaWater } from '../decorators/dayNormaWater.js';
import { determinationDailyLevel } from '../decorators/determinationDailyLevel.js';
import { nanoid } from 'nanoid';
import { User } from '../models/user.js';
import { HttpError } from '../helpers/Error/HttpError.js';
import { calculateMacros } from '../decorators/calculateMacroElem.js';
import { sendEmail } from '../helpers/sendFromPost.js';
import { generateVerificationEmailHTML } from '../helpers/generateVerificationEmailHTML.js';
import { documentSucssesfullVerification } from '../helpers/documentSucssesfullVarification.js';

const { SECRET_KEY, BASE_URL } = process.env;

const signUp = async body => {
  const { email, password } = body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (user) throw HttpError(409, `Email "${email}" in use`);

  const dailyGoalWater = dayNormaWater(body);
  const dailyGoalCalories = determinationDailyLevel(body);
  const { protein, fat, carbonohidrates } = calculateMacros(
    body,
    dailyGoalCalories,
  );

  const hashPassword = await bcryptjs.hash(password, 10);
  const date = new Date();
  const verificationToken = nanoid();

  const document = generateVerificationEmailHTML(verificationToken);

  const verifyEmail = {
    to: `${email}`,
    subject: 'Verify email!',
    html: `${document}`,
  };

  await sendEmail(verifyEmail);

  return await User.create({
    ...body,
    email: email.toLowerCase(),
    password: hashPassword,
    verificationToken,
    date: date.getDate(),
    dailyGoalWater,
    dailyGoalCalories,
    dailyGoalElements: { protein, fat, carbonohidrates },
  });
};

// -------------- Log In -------------- //
const signIn = async body => {
  const userFind = await User.findOne({ email: body.email });

  if (!userFind) throw HttpError(403, 'Email or password is wrong');

  if (!userFind.verify)
    throw HttpError(403, 'Access is forbidden. Please verify your account.');

  const comparePassword = await bcryptjs.compare(
    body.password,
    userFind.password,
  );

  if (!comparePassword) throw HttpError(403, 'Email or password is wrong');

  const payload = {
    id: userFind._id,
  };

  const token = await jwt.sign(payload, SECRET_KEY, { expiresIn: '10 years' });

  await User.findByIdAndUpdate({ _id: userFind._id }, { token });

  const {
    name,
    email,
    avatarUrl,
    goal,
    sex,
    age,
    height,
    currentWeight,
    levelActivity,
    dailyGoalCalories,
    dailyGoalWater,
    dailyGoalElements,
    verify,
  } = userFind;

  const user = {
    name,
    email,
    avatarUrl,
    goal,
    sex,
    age,
    height,
    currentWeight,
    levelActivity,
    dailyGoalCalories,
    dailyGoalWater,
    dailyGoalElements,
    token,
    verify,
  };

  return user;
};

const passwordReset = async email => {
  const userFind = await User.findOne({ email: email.toLowerCase() });
  if (!userFind) throw HttpError(404, `User with ${email} is missing`);

  const newPassword = nanoid();

  const updatedPass = newPassword + '$';
  const hashNewPassword = await bcryptjs.hash(updatedPass, 8);

  await User.findByIdAndUpdate(
    { _id: userFind._id },
    { password: hashNewPassword },
  );

  return newPassword;
};

const logout = async userId => {
  const user = await User.findByIdAndUpdate({ _id: userId }, { token: '' });
  if (!user) throw HttpError(404, 'User not found');
};

const google = async id => {
  const payload = {
    id,
  };

  const token = await jwt.sign(payload, SECRET_KEY, { expiresIn: '10 years' });

  const verificationToken = nanoid();

  await User.findByIdAndUpdate(
    { _id: id },
    { token, verificationToken },
    { new: true },
  );

  return verificationToken;
};

const authServices = {
  signUp,
  signIn,
  passwordReset,
  logout,
  google,
};

export default authServices;
