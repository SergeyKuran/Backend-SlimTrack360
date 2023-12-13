import { User } from '../models/user.js';
import { ctrlWrapper } from '../decorators/ctrlWrapper.js';

const signUp = async (req, res, next) => {
  const newUser = await User.create({
    ...req.body,
  });
  console.log('test');
  res.status(200).send({ message: 'successful' });
  next();
};

export default {
  signup: ctrlWrapper(signUp),
};
