import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dayNormaWater } from '../decorators/dayNormaWater.js';
import { determinationDailyLevel } from '../decorators/determinationDailyLevel.js';
import { nanoid } from 'nanoid';
import { User } from '../models/user.js';
import { HttpError } from '../helpers/Error/HttpError.js';
import { calculateMacros } from '../decorators/calculateMacroElem.js';

const { SECRET_KEY } = process.env;

const signUp = async body => {
  const { email, password, levelActivity, currentWeight, goal } = body;

  const user = await User.findOne({ email });
  if (user) throw HttpError(409, `Email "${email}" in use`);

  const dailtyGoalWater = dayNormaWater(levelActivity, currentWeight);
  const dailyGoalCalories = determinationDailyLevel(body);
  const { Protein, Fat, Carbonohidrates } = calculateMacros(
    goal,
    dailyGoalCalories,
  );

  const hashPassword = await bcryptjs.hash(password, 10);
  const verificationToken = nanoid();
  const date = new Date();

  return await User.create({
    ...body,
    password: hashPassword,
    verificationToken,
    date: date.getDate(),
    dailtyGoalWater,
    dailyGoalCalories,
    dailyGoalElements: { Protein, Fat, Carbonohidrates },
  });
};

const signIn = async body => {
  const userFind = await User.findOne({ email: body.email });

  if (!userFind) throw HttpError(403, 'Email or password is wrong');
  const comparePassword = bcryptjs.compare(body.password, userFind.password);

  if (!comparePassword) {
    throw HttpError(403, 'Email or password is wrong');
  }

  const payload = {
    id: userFind._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '10 years' });

  return await User.findByIdAndUpdate(userFind._id, { token });
};

const passwordReset = async body => {
  const { email, _id } = body;

  const userFind = await User.findOne({ email });
  if (!userFind) throw HttpError(404, 'Sorry, user not found');

  await User.findByIdAndUpdate({ _id }, { email });

  return email;
};

const logout = async userId => {
  const user = await User.findByIdAndUpdate({ _id: userId }, { token: '' });
  if (!user) throw HttpError(404, 'User not found');
};

const authServices = {
  signUp,
  signIn,
  passwordReset,
  logout,
};

export default authServices;
