import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import { WaterIntake } from '../models/waterIntake.js';

const getCurrentWaterIntake = async (req, res) => {
  const { date } = req.body;
  const { _id: owner } = req.user;

  const waterIntake = await WaterIntake.findOne({ date, owner });

  if (!waterIntake) {
    return res.status(404).json({ message: 'Water intake not found' });
  }

  res.status(200).json(waterIntake);
};

const addWaterIntake = async (req, res) => {
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

const deleteWaterIntake = async (req, res, next) => {
  const { date } = req.body;

  const filter = { date };

  const update = { value: 0 };

  const updatedIntake = await WaterIntake.findOneAndUpdate(filter, update, {
    new: true,
  });

  if (!updatedIntake) {
    return res.status(404).json({ message: 'Intake not found' });
  }

  return res.status(200).json(updatedIntake);
};

export default {
  todayWater: ctrlWrapper(getCurrentWaterIntake),
  addWater: ctrlWrapper(addWaterIntake),
  resetWater: ctrlWrapper(deleteWaterIntake),
};
