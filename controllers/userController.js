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
  const { name, avatarUrl, sex, age, height, currentWeight, levelActivity } =
    await userServices.updateUser(
      req.user,
      req.user._id,
      req.body,
      req.file ? req.file.path : '',
      req.user._id,
      req.body.currentWeight,
    );

  res.json({
    name,
    avatarUrl,
    sex,
    age,
    height,
    currentWeight,
    levelActivity,
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
