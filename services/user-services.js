import { User } from '../models/user.js';
import { HttpError } from '../helpers/Error/HttpError.js';

import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import { userParametrs } from '../constans/user-constants.js';
import { dayNormaWater } from '../decorators/dayNormaWater.js';

const currentUser = async user => {
  const { _id, email, goal, sex, age, height, currentWeight, levelActivity } =
    user;

  let activeIndex;
  let resultMale;
  let resultFemale;

  const { activityIndex } = userParametrs;
  if (levelActivity in activityIndex) {
    activeIndex = activityIndex[levelActivity];
  } else {
    throw HttpError(400);
  }
  //   console.log('activeIndex :>> ', activeIndex);
  if (sex === 'male') {
    resultMale =
      (88.362 + 13.397 * currentWeight + 4.799 * height - 5.677 * age) *
      activeIndex;
    // console.log('resultMale :>> ', resultMale);
  } else {
    resultFemale =
      (447.593 + 9.247 * currentWeight + 3.098 * height - 4.33 * age) *
      activeIndex;
    // console.log('resultFemale :>> ', resultFemale);
  }
};

const userServices = {
  currentUser: ctrlWrapper(currentUser),
};

export default userServices;
