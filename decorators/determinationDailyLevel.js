import { userParametrs } from '../constans/userConstants.js';
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

  const weightIndexMale = 13.397 * currentWeight;
  const heightIndexMale = 4.799 * height;
  const ageIndexMale = 5.677 * age;

  const weightIndexFemale = 9.247 * currentWeight;
  const heightIndexFemale = 3.098 * height;
  const ageIndexMaleFemale = 4.33 * age;

  if (sex === 'male') {
    resultMale =
      (88.362 + weightIndexMale + heightIndexMale - ageIndexMale) * activeIndex;
  } else {
    resultFemale =
      (447.593 + weightIndexFemale + heightIndexFemale - ageIndexMaleFemale) *
      activeIndex;
  }

  return sex === 'male' ? Math.floor(resultMale) : Math.floor(resultFemale);
};
