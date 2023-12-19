import { Schema, model } from 'mongoose';
import { handleMongooseError } from '../helpers/Error/handleMongooseError.js';

const oneInTakeSchema = new Schema({
  totalCalories: {
    type: Number,
    default: 0,
  },
  totalFat: {
    type: Number,
    default: 0,
  },
  totalCarbonohidretes: {
    type: Number,
    default: 0,
  },
  totalProtein: {
    type: Number,
    default: 0,
  },
  products: [
    {
      productId: {
        type: String,
        ref: 'product',
        require: [true, 'ID is required'],
      },
      name: {
        type: String,
        require: [true, 'Name is required'],
      },
      calories: {
        type: Number,
        require: [true, 'calories is required'],
      },
      fat: {
        type: Number,
        require: [true, 'fat is required'],
      },
      carbonohidretes: {
        type: Number,
        require: [true, 'carbonohidretes is required'],
      },
      protein: {
        type: Number,
        require: [true, 'carbonohidretes is required'],
      },
      _id: false,
    },
  ],
});

const userFoodIntakeSchema = new Schema(
  {
    date: {
      type: String,
      default: '',
      require: true,
    },
    totalCalories: {
      type: Number,
      default: 0,
    },
    totalFat: {
      type: Number,
      default: 0,
    },
    totalCarbonohidretes: {
      type: Number,
      default: 0,
    },
    totalProtein: {
      type: Number,
      default: 0,
    },
    breakfast: {
      type: oneInTakeSchema,
      default: null,
      _id: false,
    },
    lunch: {
      type: oneInTakeSchema,
      default: null,
      _id: false,
    },
    dinner: {
      type: oneInTakeSchema,
      default: null,
      _id: false,
    },
    snack: {
      type: oneInTakeSchema,
      default: null,
      _id: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

userFoodIntakeSchema.post('save', handleMongooseError);

export const FoodIntake = model('foodIntake', userFoodIntakeSchema);

// Приклади

// $inc $push

// data = await Diary.findByIdAndUpdate(
//   foundedDiary._id,
//   {
//     $inc: { burnedCalories: +calories, sportTime: +time },
//     $push: { doneExercises: { exercise, time, calories } },
//   },
//   { new: true },
// );
