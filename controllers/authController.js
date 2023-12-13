import { User } from '../models/user.js';
import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import { HttpError } from '../helpers/Error/HttpError.js';

const signUp = async (req, res, next) => {
  const { email } = req.body;

  console.log(email);
  const newUser = await User.create({
    ...req.body,
  });
  res.json({ newUser, message: 'created' });
};

export default {
  signup: ctrlWrapper(signUp),
};
