import { Schema, model } from 'mongoose';
import {
  emailRegexp,
  passwordMinLength,
  userParametrs,
} from '../constans/user-constants.js';
import { handleMongooseError } from '../helpers/Error/handleMongooseError.js';

// ----------- Schema for User Params Model -----------//
const userParamsSchema = new Schema(
  {
    goal: {
      type: String,
      require: true,
      enum: userParametrs.userSexusersGoal,
      default: 'Lose Fat',
    },
    sex: {
      type: String,
      enum: userParametrs.userSex,
    },
    age: {
      type: Number,
      require: true,
    },
    height: {
      type: Number,
      min: userParametrs.minHeight,
    },
    currentWeight: {
      type: Number,
      min: userParametrs.minCurrentWeight,
    },
    levelActivity: {
      type: Number,
      enum: userParametrs.levelActivityTypes,
    },
    dailyGoalCalories: {
      type: Number,
      default: null,
    },
    dailtyGoalWater: {
      type: Number,
      default: null,
    },
    dailyGoalElements: {
      Carbonohidrates: {
        type: Number,
        default: null,
      },
      Protein: {
        type: Number,
        default: null,
      },
      Fat: {
        type: Number,
        default: null,
      },
    },
  },
  { versionKey: false, _id: false },
);

// ----------- Schema for User Model -----------//

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, 'Name is required'],
    },
    email: {
      type: String,
      require: [true, 'Email is required'],
      match: [emailRegexp, 'Invalid email format provided'],
      index: true,
      unique: [true, 'Email in use'],
    },
    password: {
      type: String,
      require: [true, 'Password is required'],
      minLength: [
        passwordMinLength,
        `Password should be at least ${passwordMinLength} characres long`,
      ],
    },
    token: {
      type: String,
      default: '',
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    userParams: {
      type: userParamsSchema,
      default: null,
    },
  },
  { timeseries: true, versionKey: false },
);

userSchema.post('save', handleMongooseError);

export const User = model('user', userSchema);
