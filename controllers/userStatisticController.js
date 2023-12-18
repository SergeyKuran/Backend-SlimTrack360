import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import { getMonthName } from '../helpers/getMonthName.js';
import { WaterIntake } from '../models/waterIntake.js';
import { FoodIntake } from '../models/foodIntake.js';

const getUserStatistic = async (req, res, next) => {
  const { month } = req.body;

  const monthStr = month ? month.padStart(2, '0') : '';

  // ------------ Total Water -------------- //
  const userWaterIntakes = await WaterIntake.aggregate([
    {
      $match: {
        date: { $regex: `.*-${monthStr}-.*` },
        owner: req.user._id,
      },
    },
    {
      $group: {
        _id: null,
        totalWater: { $sum: '$value' },
      },
    },
  ]);

  const totalWater =
    userWaterIntakes.length > 0 ? userWaterIntakes[0].totalWater : 0;

  // ------------ Total Food -------------- //
  const userFoodIntakes = await FoodIntake.aggregate([
    {
      $match: {
        date: { $regex: `.*-${monthStr}-.*` },
        owner: req.user._id,
      },
    },
    {
      $group: {
        _id: null,
        totalCalories: { $sum: '$totalCalories' },
      },
    },
  ]);

  const totalCalories =
    userFoodIntakes.length > 0 ? userFoodIntakes[0].totalCalories : 0;

  res.status(200).json({
    totalWater,
    totalCalories,
    month: getMonthName(monthStr),
  });
};

export default {
  statistic: ctrlWrapper(getUserStatistic),
};
