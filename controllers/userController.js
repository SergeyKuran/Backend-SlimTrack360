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
    currentWeight,
    dailyGoalCalories,
    dailyGoalWater,
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
    dailyGoalWater,
    dailyGoalElements,
  });
};

const update = async (req, res) => {
  const {
    name,
    email,
    avatarUrl,
    sex,
    age,
    height,
    currentWeight,
    dailyGoalCalories,
    dailyGoalWater,
    dailyGoalElements,
  } = await userServices.updateUser(
    req.user._id,
    req.body,
    req.file ? req.file.path : '',
    req.body.date,
    req.user._id,
    req.body.currentWeight,
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
    dailyGoalWater,
    dailyGoalElements,
  });
};

const goal = async (req, res) => {
  const { goal } = await userServices.goalUser(req.user._id, req.body.goal);

  res.json({
    goal,
    message: 'Goal changed',
  });
};

const weight = async (req, res) => {
  const { currentWeight } = await userServices.weightUser(
    req.user._id,
    req.body.currentWeight,
    req.body.date,
    req.user._id,
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
