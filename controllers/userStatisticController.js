import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import { getMonthName } from '../helpers/getMonthName.js';
import { WaterIntake } from '../models/waterIntake.js';
import { FoodIntake } from '../models/foodIntake.js';
import { UserWeight } from '../models/userWeight.js';

const getUserStatistic = async (req, res, next) => {
  const { month } = req.body;
  const { _id: owner } = req.user;

  const monthStr = month ? String(month).padStart(2, '0') : '';

  // ------------ Total Water -------------- //
  const userWaterIntakes = await WaterIntake.aggregate([
    {
      $match: {
        date: { $regex: `.*-${monthStr}-.*` },
        owner,
      },
    },
    {
      $group: {
        _id: '$owner',
        totalWater: {
          $push: {
            date: '$date',
            water: '$value',
            id: '$_id',
          },
        },
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
        owner,
      },
    },
    {
      $group: {
        _id: '$owner',
        totalCalories: {
          $push: {
            date: '$date',
            totalCalories: '$totalCalories',
            id: '$_id',
          },
        },
      },
    },
  ]);

  const totalCalories =
    userFoodIntakes.length > 0 ? userFoodIntakes[0].totalCalories : 0;

  // ------------------ Monthly Arr Weight -------------- //

  const monthMap = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December',
  };

  const monthName = monthMap[month];

  const user = await UserWeight.findOne({ owner });

  const monthData = user[monthName] || 0;

  res.status(200).json({
    totalWater,
    totalCalories,
    totalWeight: monthData,
    month: getMonthName(monthStr),
  });
};

export default {
  statistic: ctrlWrapper(getUserStatistic),
};
