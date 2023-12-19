import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import { getMonthName } from '../helpers/getMonthName.js';
import { WaterIntake } from '../models/waterIntake.js';
import { FoodIntake } from '../models/foodIntake.js';
import { UserWeight } from '../models/userWeight.js';

// const getUserStatistic = async (req, res, next) => {
//   const { month } = req.body;

//   const monthStr = month ? month.padStart(2, '0') : '';

//   // ------------ Total Water -------------- //
//   const userWaterIntakes = await WaterIntake.aggregate([
//     {
//       $match: {
//         date: { $regex: `.*-${monthStr}-.*` },
//         owner: req.user._id,
//       },
//     },
//     {
//       $group: {
//         _id: null,
//         totalWater: { $sum: '$value' },
//       },
//     },
//   ]);

//   const totalWater =
//     userWaterIntakes.length > 0 ? userWaterIntakes[0].totalWater : 0;

//   // ------------ Total Food -------------- //
//   const userFoodIntakes = await FoodIntake.aggregate([
//     {
//       $match: {
//         date: { $regex: `.*-${monthStr}-.*` },
//         owner: req.user._id,
//       },
//     },
//     {
//       $group: {
//         _id: null,
//         totalCalories: { $sum: '$totalCalories' },
//       },
//     },
//   ]);

//   const totalCalories =
//     userFoodIntakes.length > 0 ? userFoodIntakes[0].totalCalories : 0;

//   res.status(200).json({
//     totalWater,
//     totalCalories,
//     month: getMonthName(monthStr),

//   });
// };

const getUserStatistic = async (req, res, next) => {
  const { month } = req.body;

  const monthStr = month ? month.padStart(2, '0') : '';

  // Calculate start and end dates for the month
  const startDate = new Date(`2023-${monthStr}-01`);
  const endDate = new Date(`2023-${monthStr}-31`);
};

export default {
  statistic: ctrlWrapper(getUserStatistic),
};
