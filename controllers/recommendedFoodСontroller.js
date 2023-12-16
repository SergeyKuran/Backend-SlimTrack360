import { RecommendedFood } from '../models/recommendedFood.js';
import { ctrlWrapper } from '../decorators/ctrlWrapper.js';

export const getRecommendedFood = async (_, res) => {
  const data = await RecommendedFood.find();
  res.json(data);
};

export default {
  getAllFood: ctrlWrapper(getRecommendedFood),
};
