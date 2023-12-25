import { format } from 'date-fns';
import { HttpError } from '../helpers/Error/HttpError.js';
import { User } from '../models/user.js';
import { determinationDailyLevel } from '../decorators/determinationDailyLevel.js';
import { dayNormaWater } from '../decorators/dayNormaWater.js';
import { calculateMacros } from '../decorators/calculateMacroElem.js';
import { UserWeight } from '../models/userWeight.js';

const currentUser = async userId => {
  const userFind = await User.findOne({ _id: userId });

  if (!userFind) throw HttpError(404, 'User not found');

  const dailyGoalCalories = determinationDailyLevel(userFind);
  const dailyGoalWater = dayNormaWater(userFind);
  const { protein, fat, carbonohidrates } = calculateMacros(
    userFind,
    dailyGoalCalories,
  );

  const updatedUser = await User.findByIdAndUpdate(
    { _id: userId },
    {
      dailyGoalCalories,
      dailyGoalWater,
      dailyGoalElements: { protein, fat, carbonohidrates },
      verify: true,
    },
    { new: true },
  );

  return updatedUser;
};

const updateUser = async (
  userOnBase,
  userId,
  userData,
  pathAvatar,
  owner,
  currentWeight,
) => {
  const user = { ...userData };

  const avatar = pathAvatar === '' ? userOnBase.avatarUrl : pathAvatar;

  const newUser = await User.findByIdAndUpdate(
    { _id: userId },
    { $set: user, avatarUrl: avatar },
    { new: true },
  );

  const dailyGoalCalories = determinationDailyLevel(newUser);
  const dailyGoalWater = dayNormaWater(newUser);
  const { protein, fat, carbonohidrates } = calculateMacros(
    newUser,
    dailyGoalCalories,
  );

  const updatedUser = await User.findByIdAndUpdate(
    { _id: userId },
    {
      dailyGoalCalories,
      dailyGoalWater,
      dailyGoalElements: { protein, fat, carbonohidrates },
    },
    { new: true },
  );

  // Update Weight
  // Add obj with weight
  const formattedDate = format(new Date(), 'yyyy-MM-dd');
  const currentMonth = format(new Date(), 'MMMM');

  let userWeight = await UserWeight.findOne({ owner });

  if (!userWeight[currentMonth]) {
    userWeight[currentMonth] = [];
  }

  userWeight[currentMonth].push({
    date: formattedDate,
    weight: currentWeight,
  });

  await userWeight.save();

  return updatedUser;
};

const goalUser = async (user, goal = user.goal) => {
  const goalArray = ['Lose Fat', 'Maintain', 'Gain Muscle'];

  if (!goalArray.includes(goal)) throw HttpError(404, 'This goal not found!');

  const newUser = await User.findByIdAndUpdate(
    { _id: user._id },
    { goal },
    { new: true },
  );

  const { protein, fat, carbonohidrates } = calculateMacros(
    newUser,
    user.dailyGoalCalories,
  );

  const updatedUser = await User.findByIdAndUpdate(
    { _id: user._id },
    {
      dailyGoalElements: { protein, fat, carbonohidrates },
    },
    { new: true },
  );

  return updatedUser;
};

const weightUser = async (userId, currentWeight, owner) => {
  const newUser = await User.findByIdAndUpdate(
    { _id: userId },
    { currentWeight },
    { new: true },
  );

  const newDailyLevel = determinationDailyLevel(newUser);
  const newNormaWater = dayNormaWater(newUser);

  const updatedUser = await User.findByIdAndUpdate(
    { _id: userId },
    {
      dailyGoalCalories: newDailyLevel,
      dailyGoalWater: newNormaWater,
    },
    { new: true },
  );

  // Add obj with weight
  let userWeight = await UserWeight.findOneAndUpdate(
    { owner },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  const formattedDate = format(new Date(), 'yyyy-MM-dd');
  const currentMonth = format(new Date(), 'MMMM');

  if (!userWeight[currentMonth]) {
    userWeight[currentMonth] = [];
  }

  userWeight[currentMonth].push({
    date: formattedDate,
    weight: currentWeight,
  });

  await userWeight.save();

  return updatedUser;
};

const userServices = {
  currentUser,
  updateUser,
  goalUser,
  weightUser,
};

export default userServices;
