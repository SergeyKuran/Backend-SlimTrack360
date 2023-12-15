import { format } from 'date-fns';
import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import { FoodIntake } from '../models/food-intake.js';

const addFoodIntake = async (req, res, nex) => {
  const { _id: owner } = req.user;

  console.log('Request Body Date:', req.body.date);

  req.body.date = format(new Date(req.body.date), 'yyyy-MM-dd');

  const { date, breakfast, lunch, dinner, snack, _id } =
    await FoodIntake.create({
      ...req.body,
      owner,
    });

  res.status(200).json({
    date,
    breakfast,
    lunch,
    dinner,
    snack,
    owner,
    _id,
  });
};

export default {
  addFood: ctrlWrapper(addFoodIntake),
};
