import { format } from 'date-fns';
import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import { FoodIntake } from '../models/food-intake.js';

const addFoodIntake = async (req, res, next) => {
  const { date, breakfast, lunch, dinner, snack } = req.body;
  const { _id: owner } = req.user;

  const formattedDate = format(new Date(date), 'yyyy-MM-dd');

  let existingIntake = await FoodIntake.findOne({
    date: formattedDate,
    owner,
  });

  if (existingIntake) {
    // Update existing entry
    if (!existingIntake.breakfast) {
      existingIntake.breakfast = { products: [] };
    }
    if (!existingIntake.lunch) {
      existingIntake.lunch = { products: [] };
    }
    if (!existingIntake.dinner) {
      existingIntake.dinner = { products: [] };
    }
    if (!existingIntake.snack) {
      existingIntake.snack = { products: [] };
    }

    if (dinner) existingIntake.dinner.products.push(...dinner.products);
    if (lunch) existingIntake.lunch.products.push(...lunch.products);
    if (breakfast)
      existingIntake.breakfast.products.push(...breakfast.products);
    if (snack) existingIntake.snack.products.push(...snack.products);

    await existingIntake.save();

    existingIntake = await FoodIntake.findOne({ date: formattedDate, owner });
    res.status(200).json({
      message: 'Products added to existing entry',
      data: existingIntake,
    });
  } else {
    // Create new entry
    const newFoodIntake = new FoodIntake({
      date: formattedDate,
      breakfast: breakfast || { products: [] },
      lunch: lunch || { products: [] },
      dinner: dinner || { products: [] },
      snack: snack || { products: [] },
      owner,
    });
    await newFoodIntake.save();

    const createdIntake = await FoodIntake.findOne({
      date: formattedDate,
      owner,
    });
    res.status(201).json({ message: 'New entry created', data: createdIntake });
  }
};

export default {
  addFood: ctrlWrapper(addFoodIntake),
};
