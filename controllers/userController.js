import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import userServices from '../services/userServices.js';

const current = async (req, res, next) => {
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

const update = async (req, res, next) => {
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
  } = await userServices.updateUser(
    req.user._id,
    req.body,
    req.file ? req.file.path : '',
  );

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

const goal = async (req, res, next) => {
  const { goal } = await userServices.goalUser(req.user._id, req.body.goal);

  res.json({
    goal,
    message: 'Goal changed',
  });
};

const weight = async (req, res, next) => {
  const { currentWeight } = await userServices.weightUser(
    req.user._id,
    req.body.currentWeight,
  );

  res.json({
    currentWeight,
    message: 'Weight changed',
  });
};

export default {
  current: ctrlWrapper(current),
  update: ctrlWrapper(update),
  goal: ctrlWrapper(goal),
  weight: ctrlWrapper(weight),
};
