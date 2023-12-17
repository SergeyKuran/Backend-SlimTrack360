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

const updateProductFoodIntake = async (req, res, next) => {
  try {
    const { id: foodIntakeId } = req.params;

    const { productId, updatedFields } = req.body;
    const { owner } = req.user;

    const sectionToUpdate = req.params.section;

    if (!['breakfast', 'lunch', 'dinner', 'snack'].includes(sectionToUpdate)) {
      return res.status(400).json({ message: 'Invalid section provided' });
    }

    const filter = { _id: foodIntakeId, owner };
    filter[`${sectionToUpdate}.products.productId`] = productId;

    const update = { $set: {} };
    update.$set[`${sectionToUpdate}.products.$`] = updatedFields;

    const options = { new: true };

    let updatedFoodIntake = await FoodIntake.findOneAndUpdate(
      filter,
      update,
      options,
    );

    await updateIntakeTotals(updatedFoodIntake);

    if (!updatedFoodIntake) {
      console.log('Product not found or Food Intake not found');
      return res
        .status(404)
        .json({ message: 'Food Intake not found or product not found' });
    }

    res
      .status(200)
      .json({ message: 'Product updated', data: updatedFoodIntake });
  } catch (error) {
    next(error);
  }
};

const deleteFoodIntake = async (req, res, next) => {
  try {
    const { date, breakfast, lunch, dinner, snack } = req.body;
    const { _id: owner } = req.user;

    const formattedDate = format(new Date(date), 'yyyy-MM-dd');

    const sections = ['snack', 'dinner', 'lunch', 'breakfast'];
    let updatedIntake = null;
    let section = null;

    for (const sec of sections) {
      const sectionData = req.body[sec];
      if (sectionData && sectionData.products) {
        const query = { date: formattedDate, owner };
        query[`${sec}.products.productId`] = sectionData.products[0].productId;

        updatedIntake = await FoodIntake.findOneAndUpdate(
          query,
          {
            $pull: {
              [`${sec}.products`]: {
                productId: sectionData.products[0].productId,
              },
            },
          },
          { new: true },
        );

        if (updatedIntake) {
          section = sec;
          break;
        }
      }
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
  } catch (error) {
    next(error);
  }
};

export default {
  addFood: ctrlWrapper(addFoodIntake),
  updateFood: ctrlWrapper(updateProductFoodIntake),
  deleteFood: ctrlWrapper(deleteFoodIntake),
};
