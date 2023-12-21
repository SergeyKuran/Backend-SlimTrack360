import { HttpError } from './Error/HttpError.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { ctrlWrapper } from '../decorators/ctrlWrapper.js';

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

// const { SECRET_KEY } = process.env;

// const authenticate = async (req, res, next) => {
//   const { authorization = '' } = req.headers;

//   if (
//     authorization === '' ||
//     authorization === undefined ||
//     authorization === null
//   )
//     throw HttpError(403, 'Invalid authorization');

//   const [bearer, token] = authorization.split(' ');

//   if (bearer !== 'Bearer') {
//     HttpError(401), 'Not authorized';
//     next();
//   }

//   try {
//     const { id } = jwt.verify(token, SECRET_KEY);
//     const user = await User.findById(id);

//     if (!user || !user.token || user.token !== token)
//       next(HttpError(401), 'Not authorized');

//     req.user = user;

//     next();
//   } catch {
//     next(HttpError(401), 'Not authorized');
//   }
// };

// export default ctrlWrapper(authenticate);
