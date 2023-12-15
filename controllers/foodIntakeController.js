import { format } from 'date-fns';
import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import { FoodIntake } from '../models/food-intake.js';

const addFoodIntake = async (req, res, next) => {
  const { _id: owner } = req.user;
  const date = format(new Date(req.body.date), 'yyyy-MM-dd');
  const { breakfast, lunch, dinner, snack } = req.body;

  const existingIntake = await FoodIntake.findOne({ date, owner });

  if (existingIntake) {
    // Если запись существует, обновляем ее содержимое
    existingIntake.breakfast = breakfast;
    existingIntake.lunch = lunch;
    existingIntake.dinner = dinner;
    existingIntake.snack = snack;
    await existingIntake.save();
    res.status(200).json({ message: 'Food intake updated successfully' });
  } else {
    // Если запись не существует, создаем новую
    const newIntake = new FoodIntake({
      owner,
      date,
      breakfast,
      lunch,
      dinner,
      snack,
    });
    await newIntake.save();
    res.status(201).json({ message: 'Food intake added successfully' });
  }
};

export default {
  addFood: ctrlWrapper(addFoodIntake),
};
