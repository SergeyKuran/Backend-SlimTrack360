import { Schema, model } from 'mongoose';
import { handleMongooseError } from '../helpers/Error/handleMongooseError.js';

const userWeightSchema = new Schema(
  {
    date: {
      type: String,
      default: '',
      require: true,
    },
    weight: {
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

userWeightSchema.post('save', handleMongooseError);

export const userWeight = model('userWeight', userWeightSchema);
