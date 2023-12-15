import { User } from '../models/user.js';
import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import { HttpError } from '../helpers/Error/HttpError.js';
import userServices from '../services/user-services.js';

const current = async (req, res, next) => {
  console.log('req.user.name :>> ', req.user.name);
  const {
    name,
    email,
    avatarUrl,
    sex,
    age,
    height,
    currentWeight,
    dailyGoalCalories,
    dailtyGoalWater,
    dailyGoalElements,
  } = await userServices.currentUser(req.user._id);

  res.json({
    name,
    email,
    avatarUrl,
    sex,
    age,
    height,
    currentWeight,
    dailyGoalCalories,
    dailtyGoalWater,
    dailyGoalElements,
  });
};

export default {
  current: ctrlWrapper(current),
};
