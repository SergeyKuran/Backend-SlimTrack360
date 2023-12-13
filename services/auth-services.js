import { User } from '../models/user.js';
import { HttpError } from '../helpers/Error/HttpError.js';

import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';

const { JWT_SECRET } = process.env;

const signUp = async body => {
  const { email, password } = body;

  const user = await User.findOne({ email });
  if (user) throw HttpError(409, `Email "${email}" in use`);

  const hashPassword = await bcryptjs.hash(password, 10);
  const verificationToken = nanoid();
  const date = new Date();

  return await User.create({
    ...body,
    password: hashPassword,
    verificationToken,
    date: date.getDate(),
  });
};

const signIn = async body => {
  const userFind = await User.findOne({ email: body.email });

  if (!userFind) throw HttpError(403, 'Email or password is wrong');

  const comparePassword = await bcryptjs.compare(
    body.password,
    userFind.password,
  );

  if (!comparePassword) {
    throw HttpError(403, 'Email or password is wrong');
  }

  const payload = {
    id: userFind._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' });

  const user = await User.findByIdAndUpdate(userFind._id, { token });

  return {
    token,
    user,
  };
};

const logout = async userId => {
  const user = await User.findByIdAndUpdate({ _id: userId }, { token: '' });
  if (!user) throw HttpError(404, 'User not found');
};

const authServices = {
  signUp,
  signIn,
  logout,
};

export default authServices;
