import { Schema, model } from 'mongoose';
import { handleMongooseError } from '../helpers/Error/handleMongooseError';

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
        type: Schema.Types.String,
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
    breackfast: {
      type: oneInTakeSchema,
      default: null,
    },
    lunch: {
      type: oneInTakeSchema,
      default: null,
    },
    dinner: {
      type: oneInTakeSchema,
      default: null,
    },
    snack: {
      type: oneInTakeSchema,
      default: null,
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
