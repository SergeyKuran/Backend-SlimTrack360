import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import { WaterIntake } from '../models/waterIntake.js';

const addWaterIntake = async (req, res) => {
  const { _id: owner } = req.user;
  const { date, value } = req.body;

  const waterValue = parseFloat(value || 0);

  let existingIntake = await WaterIntake.findOne({ date, owner });

  if (existingIntake) {
    existingIntake.value += waterValue;
    await existingIntake.save();
    return res.status(200).json(existingIntake);
  } else {
    const newIntake = await WaterIntake.create({
      date,
      owner,
      value: waterValue,
    });
    const responseData = { ...newIntake.toJSON() };
    delete responseData.owner;
    return res.status(201).json(responseData);
  }
};

const deleteWaterIntake = async (req, res) => {
  const { date } = req.body;
  const { _id: owner } = req.user;

  console.log('Body: >>>>>', req.body);

  const filter = { date, owner };

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
  addWater: ctrlWrapper(addWaterIntake),
  resetWater: ctrlWrapper(deleteWaterIntake),
};
