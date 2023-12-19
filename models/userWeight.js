import { Schema, model } from 'mongoose';
import { handleMongooseError } from '../helpers/Error/handleMongooseError.js';

const userWeightSchema = new Schema(
  {
    January: [
      {
        date: {
          type: String,
          required: true,
        },
        weight: {
          type: Number,
          default: 0,
        },
      },
    ],
    February: [
      {
        date: {
          type: String,
          required: true,
        },
        weight: {
          type: Number,
          default: 0,
        },
      },
    ],
    March: [
      {
        date: {
          type: String,
          required: true,
        },
        weight: {
          type: Number,
          default: 0,
        },
      },
    ],
    April: [
      {
        date: {
          type: String,
          required: true,
        },
        weight: {
          type: Number,
          default: 0,
        },
      },
    ],
    May: [
      {
        date: {
          type: String,
          required: true,
        },
        weight: {
          type: Number,
          default: 0,
        },
      },
    ],
    June: [
      {
        date: {
          type: String,
          required: true,
        },
        weight: {
          type: Number,
          default: 0,
        },
      },
    ],
    July: [
      {
        date: {
          type: String,
          required: true,
        },
        weight: {
          type: Number,
          default: 0,
        },
      },
    ],
    August: [
      {
        date: {
          type: String,
          required: true,
        },
        weight: {
          type: Number,
          default: 0,
        },
      },
    ],
    September: [
      {
        date: {
          type: String,
          required: true,
        },
        weight: {
          type: Number,
          default: 0,
        },
      },
    ],
    October: [
      {
        date: {
          type: String,
          required: true,
        },
        weight: {
          type: Number,
          default: 0,
        },
      },
    ],
    November: [
      {
        date: {
          type: String,
          required: true,
        },
        weight: {
          type: Number,
          default: 0,
        },
      },
    ],
    December: [
      {
        date: {
          type: String,
          required: true,
        },
        weight: {
          type: Number,
          default: 0,
        },
      },
    ],
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

export const UserWeight = model('userWeight', userWeightSchema);
