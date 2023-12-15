import { HttpError } from './Error/HttpError.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer') {
    throw HttpError(401);
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token) {
      throw HttpError(401);
    }

    req.user = user;

    next();
  } catch (error) {
    next(HttpError(401));
  }
};

export default authenticate;
