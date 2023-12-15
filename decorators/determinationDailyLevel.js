import { userParametrs } from '../constans/user-constants.js';
import { HttpError } from '../helpers/Error/HttpError.js';

export const determinationDailyLevel = user => {
  const { sex, age, height, currentWeight, levelActivity } = user;

  let activeIndex;
  let resultMale;
  let resultFemale;

  const { activityIndex } = userParametrs;
  if (levelActivity in activityIndex) {
    activeIndex = activityIndex[levelActivity];
  } else {
    throw HttpError(400, 'Level not found');
  }

  if (sex === 'male') {
    resultMale =
      (88.362 + 13.397 * currentWeight + 4.799 * height - 5.677 * age) *
      activeIndex;
  } else {
    resultFemale =
      (447.593 + 9.247 * currentWeight + 3.098 * height - 4.33 * age) *
      activeIndex;
  }

  return sex === 'male' ? Math.floor(resultMale) : Math.floor(resultFemale);
};
