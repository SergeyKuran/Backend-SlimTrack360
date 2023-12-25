import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import userServices from '../services/userServices.js';

const current = async (req, res) => {
  const {
    name,
    email,
    avatarUrl,
    sex,
    age,
    height,
    goal,
    currentWeight,
    levelActivity,
    dailyGoalCalories,
    dailyGoalWater,
    dailyGoalElements,
    verify,
  } = await userServices.currentUser(req.user._id);

  res.json({
    name,
    email,
    avatarUrl,
    sex,
    age,
    height,
    goal,
    currentWeight,
    levelActivity,
    dailyGoalCalories,
    dailyGoalWater,
    dailyGoalElements,
    verify,
  });
};

const update = async (req, res) => {
  const user = await userServices.updateUser(
    req.user,
    req.user._id,
    req.body,
    req.file ? req.file.path : '',
    req.user._id,
    req.body.currentWeight,
    req.body.date,
  );

  res.json({
    user,
  });
};

const goal = async (req, res) => {
  const user = await userServices.goalUser(req.user, req.body.goal);

  res.json({
    user,
    message: 'Goal changed',
  });
};

const weight = async (req, res) => {
  const user = await userServices.weightUser(
    req.user._id,
    req.body.currentWeight,
    req.user._id,
    req.user._date,
  );

  res.json({
    user,
    message: 'Weight changed',
  });
};

export default {
  current: ctrlWrapper(current),
  update: ctrlWrapper(update),
  goal: ctrlWrapper(goal),
  weight: ctrlWrapper(weight),
};
