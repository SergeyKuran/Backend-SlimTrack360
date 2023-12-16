import { Schema, model } from 'mongoose';
import { handleMongooseError } from '../helpers/Error/handleMongooseError';

const userWaterIntakeSchema = new Schema(
  {
    date: {
      type: String,
      default: '',
      require: true,
    },
    water: {
      type: Number,
      default: 0,
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

userWaterIntakeSchema.post('save', handleMongooseError);

export const WaterIntake = model('waterIntake', userWaterIntakeSchema);
