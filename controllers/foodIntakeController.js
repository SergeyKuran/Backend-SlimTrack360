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

// const deleteFoodIntake = async (req, res, next) => {
//   try {
//     const { date, breakfast, lunch, dinner, snack } = req.body;
//     const { _id: owner } = req.user;

//     const formattedDate = format(new Date(date), 'yyyy-MM-dd');

//     const sections = ['snack', 'dinner', 'lunch', 'breakfast'];
//     let updatedIntake = null;
//     let section = null;

//     for (const sec of sections) {
//       const sectionData = req.body[sec];
//       if (sectionData && sectionData.products) {
//         const query = { date: formattedDate, owner };
//         query[`${sec}.products.productId`] = sectionData.products[0].productId;

//         updatedIntake = await FoodIntake.findOneAndUpdate(
//           query,
//           {
//             $pull: {
//               [`${sec}.products`]: {
//                 productId: sectionData.products[0].productId,
//               },
//             },
//           },
//           { new: true },
//         );

//         if (updatedIntake) {
//           section = sec;
//           break;
//         }
//       }
//     }

//     if (!updatedIntake) {
//       return res.status(404).json({
//         error: 'Food intake not found or product not in specified section',
//       });
//     }

//     await updateIntakeTotals(updatedIntake);

//     return res.status(200).json({
//       message: `Product deleted from ${section}`,
//       data: updatedIntake,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const deleteFoodIntake = async (req, res, next) => {
  try {
    const { date, breakfast, lunch, dinner, snack } = req.body;
    const { _id: owner } = req.user;

    const formattedDate = format(new Date(date), 'yyyy-MM-dd');

    let targetSection = null;
    let targetProducts = null;

    if (breakfast && breakfast.products && breakfast.products.length > 0) {
      targetSection = 'breakfast';
      targetProducts = breakfast.products;
    } else if (lunch && lunch.products && lunch.products.length > 0) {
      targetSection = 'lunch';
      targetProducts = lunch.products;
    } else if (dinner && dinner.products && dinner.products.length > 0) {
      targetSection = 'dinner';
      targetProducts = dinner.products;
    } else if (snack && snack.products && snack.products.length > 0) {
      targetSection = 'snack';
      targetProducts = snack.products;
    } else {
      return res.status(400).json({
        error: 'No valid section or products specified for deletion',
      });
    }

    const productId = targetProducts[0].productId; // Получаем только productId

    const query = { date: formattedDate, owner };

    const updateOperation = {
      $pull: {
        [`${targetSection}.products`]: { productId },
      },
    };

    const updatedIntake = await FoodIntake.findOneAndUpdate(
      query,
      updateOperation,
      { new: true },
    );

    if (!updatedIntake) {
      return res.status(404).json({
        error: 'Food intake not found or product not in specified section',
      });
    }

    await updateIntakeTotals(updatedIntake);

    return res.status(200).json({
      message: `Product deleted from ${targetSection}`,
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
