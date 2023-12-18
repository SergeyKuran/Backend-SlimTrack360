import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import { getMonthName } from '../helpers/getMonthName.js';
import { WaterIntake } from '../models/waterIntake.js';

const getUserStatistic = async (req, res, next) => {
  const { month } = req.body;

  const monthStr = month ? month.padStart(2, '0') : '';

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

  res.status(200).json({
    totalWater,
    month: getMonthName(monthStr),
  });
};

export default {
  statistic: ctrlWrapper(getUserStatistic),
};
