import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import { getMonthName } from '../helpers/getMonthName.js';
import { WaterIntake } from '../models/waterIntake.js';
import { FoodIntake } from '../models/foodIntake.js';
import { UserWeight } from '../models/userWeight.js';

const getUserStatistic = async (req, res, next) => {
  const { month } = req.body;
  const { _id: owner } = req.user;

  const monthStr = month ? month.padStart(2, '0') : '';

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

  const userWeightIntakes = await UserWeight.aggregate([
    {
      $match: {
        date: { $regex: `.*-${monthStr}-.*` },
        owner,
      },
    },
    {
      $group: {
        _id: '$owner',
        totalWeight: {
          $push: {
            date: '$date',
            weight: '$weight',
            id: '$_id',
          },
        },
      },
    },
  ]);

  const totalWeight =
    userWeightIntakes.length > 0 ? userWeightIntakes[0].currentWeight : 0;
  // ------------------ Monthly Arr Weight -------------- //

  const monthMap = {
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    10: 'October',
    11: 'November',
    12: 'December',
  };

  const monthName = monthMap[month];

  const user = await UserWeight.findOne({ owner });

  const monthData = user[monthName] || [];

  res.status(200).json({
    totalWater,
    totalCalories,
    totalWeight,
    month: getMonthName(monthStr),
  });
};

export default {
  statistic: ctrlWrapper(getUserStatistic),
};
