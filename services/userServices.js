import { HttpError } from '../helpers/Error/HttpError.js';
import { User } from '../models/user.js';
import { determinationDailyLevel } from '../decorators/determinationDailyLevel.js';
import { dayNormaWater } from '../decorators/dayNormaWater.js';
import { calculateMacros } from '../decorators/calculateMacroElem.js';

const currentUser = async userId => {
  const userFind = await User.findOne({ _id: userId });

  if (!userFind) throw HttpError(404, 'User not found');

  return userFind;
};

const updateUser = async (userId, userData, pathAvatar) => {
  const user = { ...userData };

  const newUser = await User.findByIdAndUpdate(
    { _id: userId },
    { $set: user, avatarUrl: pathAvatar },
    { new: true },
  );

  const newDailyLevel = determinationDailyLevel(newUser);
  const newNormaWater = dayNormaWater(newUser);
  const { protein, fat, carbonohidrates } = calculateMacros(newUser);

  const updatedUser = await User.findByIdAndUpdate(
    { _id: userId },
    {
      dailyGoalCalories: newDailyLevel,
      dailtyGoalWater: newNormaWater,
      dailyGoalElements: { protein, fat, carbonohidrates },
    },
    { new: true },
  );

  return updatedUser;
};

const goalUser = async (userId, goal) => {
  const newUser = await User.findByIdAndUpdate(
    { _id: userId },
    { goal },
    { new: true },
  );

  const { Protein, Fat, Carbonohidrates } = calculateMacros(newUser);

  const updatedUser = await User.findByIdAndUpdate(
    { _id: userId },
    {
      dailyGoalElements: { Protein, Fat, Carbonohidrates },
    },
    { new: true },
  );

  return updatedUser;
};

const weightUser = async (userId, currentWeight) => {
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
      dailtyGoalWater: newNormaWater,
    },
    { new: true },
  );

  return updatedUser;
};

const userServices = {
  currentUser,
  updateUser,
  goalUser,
  weightUser,
};

export default userServices;
