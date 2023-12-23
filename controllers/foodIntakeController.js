import { format } from 'date-fns';
import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import { FoodIntake } from '../models/foodIntake.js';
import { updateIntakeTotals } from '../helpers/foodIntake.js/updateTotals.js';

const addFoodIntake = async (req, res) => {
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

const updateProductFoodIntake = async (req, res, next) => {
  const { id } = req.params;
  const { breakfast, lunch, dinner, snack } = req.body;

  let existingFoodIntake = await FoodIntake.findById(id);

  if (!existingFoodIntake) {
    console.log('Food Intake not found');
    return res.status(404).json({ message: 'Food Intake not found' });
  }

  const updateProducts = (existingProducts, updatedProducts) => {
    updatedProducts.forEach(updatedProduct => {
      const existingProductIndex = existingProducts.findIndex(
        product => product.productId === updatedProduct.productId,
      );
      if (existingProductIndex !== -1) {
        existingProducts[existingProductIndex] = updatedProduct;
      } else {
        existingProducts.push(updatedProduct);
      }
    });
  };

  if (breakfast && breakfast.products && breakfast.products.length > 0) {
    updateProducts(existingFoodIntake.breakfast.products, breakfast.products);
  }

  if (lunch && lunch.products && lunch.products.length > 0) {
    updateProducts(existingFoodIntake.lunch.products, lunch.products);
  }

  if (dinner && dinner.products && dinner.products.length > 0) {
    updateProducts(existingFoodIntake.dinner.products, dinner.products);
  }

  if (snack && snack.products && snack.products.length > 0) {
    updateProducts(existingFoodIntake.snack.products, snack.products);
  }

  await updateIntakeTotals(existingFoodIntake);
  existingFoodIntake = await existingFoodIntake.save();

  res
    .status(200)
    .json({ message: 'Food Intake updated', data: existingFoodIntake });
};

const deleteFoodIntake = async (req, res, next) => {
  try {
    const { _id, lunch, dinner, breakfast, snack } = req.body;

    console.log('FOOD CONTROLLER: >>>', _id);
    if (!_id || (!lunch && !dinner && !breakfast && !snack)) {
      return res.status(400).json({
        error: 'Missing _id or section field in the request',
      });
    }

    let targetSection = '';
    let targetProducts = [];

    if (lunch && lunch.products) {
      targetSection = 'lunch.products';
      targetProducts = lunch.products;
    } else if (dinner && dinner.products) {
      targetSection = 'dinner.products';
      targetProducts = dinner.products;
    } else if (breakfast && breakfast.products) {
      targetSection = 'breakfast.products';
      targetProducts = breakfast.products;
    } else if (snack && snack.products) {
      targetSection = 'snack.products';
      targetProducts = snack.products;
    } else {
      return res.status(400).json({
        error: 'No valid section or products specified for deletion',
      });
    }

    const updateOperation = { [targetSection]: [] };

    const updatedIntake = await FoodIntake.findByIdAndUpdate(
      _id,
      { $set: updateOperation },
      { new: true },
    );

    if (!updatedIntake) {
      return res.status(404).json({
        error: 'Food intake not found',
      });
    }
    await updateIntakeTotals(updatedIntake);

    return res.status(200).json({
      message: `Products in ${
        targetSection.split('.')[0]
      } cleared successfully`,
      data: updatedIntake,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  addFood: ctrlWrapper(addFoodIntake),
  updateFood: ctrlWrapper(updateProductFoodIntake),
  deleteFood: ctrlWrapper(deleteFoodIntake),
};
