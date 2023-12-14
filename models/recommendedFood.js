import { Schema, model } from 'mongoose';
import { handleMongooseError } from '../helpers/Error/handleMongooseError.js';

const recommendedFoodSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  amount: {
    type: String,
    require: true,
  },
  img: {
    type: String,
    require: true,
  },
  calories: {
    type: Number,
    require: true,
  },
  nutrition: {
    carbohydrates: {
      type: Number,
      require: true,
    },
    protein: {
      type: Number,
      require: true,
    },
    fat: {
      type: Number,
      require: true,
    },
  },
});

recommendedFoodSchema.post('save', handleMongooseError);

export const RecommendedFood = model('recommendedFood', recommendedFoodSchema);
