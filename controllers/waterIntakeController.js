import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import { WaterIntake } from '../models/waterIntake.js';

const addWaterIntake = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { date, value } = req.body;

  const existingIntake = await WaterIntake.findOne({ date, owner });

  if (existingIntake) {
    existingIntake.value += value;
    await existingIntake.save();
    res.status(200).json(existingIntake);
  } else {
    const newIntake = await WaterIntake.create({ date, value, owner });
    const responseData = { ...newIntake.toJSON() };
    delete responseData.owner;

    res.status(201).json(responseData);
  }
};

export default {
  addWater: ctrlWrapper(addWaterIntake),
};
