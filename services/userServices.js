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
    },
    { new: true },
  );

  return updatedUser;
};

const updateUser = async (userId, userData, pathAvatar) => {
  const user = { ...userData };

  const newUser = await User.findByIdAndUpdate(
    { _id: userId },
    { $set: user, avatarUrl: pathAvatar },
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

const weightUser = async (userId, currentWeight, date, owner) => {
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

  // Add obj with weight
  const formattedDate = format(new Date(date), 'yyyy-MM-dd');
  const currentMonth = format(new Date(date), 'MMMM');

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

const userServices = {
  currentUser,
  updateUser,
  goalUser,
  weightUser,
};

export default userServices;
