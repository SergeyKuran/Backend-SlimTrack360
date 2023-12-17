import { format } from 'date-fns';
import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import { FoodIntake } from '../models/foodIntake.js';
import { updateIntakeTotals } from '../helpers/foodIntake.js/updateTotals.js';

const addFoodIntake = async (req, res, next) => {
  const { date, breakfast, lunch, dinner, snack } = req.body;
  const { _id: owner } = req.user;

  const formattedDate = format(new Date(date), 'yyyy-MM-dd');

  let existingIntake = await FoodIntake.findOne({
    date: formattedDate,
    owner,
  });

  if (existingIntake) {
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
    await updateIntakeTotals(existingIntake);
    existingIntake = await FoodIntake.findOne({ date: formattedDate, owner });
    res.status(200).json({
      message: 'Products added to existing entry',
      data: existingIntake,
    });
  } else {
    const newFoodIntake = new FoodIntake({
      date: formattedDate,
      breakfast: breakfast || { products: [] },
      lunch: lunch || { products: [] },
      dinner: dinner || { products: [] },
      snack: snack || { products: [] },
      owner,
    });
    await newFoodIntake.save();
    await updateIntakeTotals(newFoodIntake);

    const createdIntake = await FoodIntake.findOne({
      date: formattedDate,
      owner,
    });
    res.status(201).json({ message: 'New entry created', data: createdIntake });
  }
};

const updateProductFoodIntake = async (req, res, next) => {};

const deleteFoodIntake = async (req, res, next) => {
  const { date, breakfast, lunch, dinner, snack } = req.body;
  const { _id: owner } = req.user;

  const formattedDate = format(new Date(date), 'yyyy-MM-dd');

  let updatedIntake = null;
  let section = null;

  if (snack && snack.products) {
    updatedIntake = await FoodIntake.findOneAndUpdate(
      { date: formattedDate, owner },
      {
        $pull: {
          'snack.products': { productId: snack.products[0].productId },
        },
      },
      { new: true },
    );
    section = 'snack';
  } else if (dinner && dinner.products) {
    updatedIntake = await FoodIntake.findOneAndUpdate(
      { date: formattedDate, owner },
      {
        $pull: {
          'dinner.products': { productId: dinner.products[0].productId },
        },
      },
      { new: true },
    );
    section = 'dinner';
  } else if (lunch && lunch.products) {
    updatedIntake = await FoodIntake.findOneAndUpdate(
      { date: formattedDate, owner },
      {
        $pull: {
          'lunch.products': { productId: lunch.products[0].productId },
        },
      },
      { new: true },
    );
    section = 'lunch';
  } else if (breakfast && breakfast.products) {
    updatedIntake = await FoodIntake.findOneAndUpdate(
      { date: formattedDate, owner },
      {
        $pull: {
          'breakfast.products': {
            productId: breakfast.products[0].productId,
          },
        },
      },
      { new: true },
    );
    section = 'breakfast';
  }

  if (!updatedIntake) {
    return res.status(404).json({
      error: 'Food intake not found or product not in specified section',
    });
  }

  await updateIntakeTotals(updatedIntake);

  return res.status(200).json({
    message: `Product deleted from ${section}`,
    data: updatedIntake,
  });
};

export default {
  addFood: ctrlWrapper(addFoodIntake),
  deleteFood: ctrlWrapper(deleteFoodIntake),
};
