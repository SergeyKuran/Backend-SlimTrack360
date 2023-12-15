import { HttpError } from '../helpers/Error/HttpError.js';
import { User } from '../models/user.js';

const currentUser = async userId => {
  const userFind = await User.findOne({ _id: userId });

  if (!userFind) throw HttpError(404, 'User not found');

  return userFind;
};

const userServices = {
  currentUser,
};

export default userServices;
