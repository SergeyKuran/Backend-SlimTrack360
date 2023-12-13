/* eslint-disable no-useless-escape */
export const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // example@example.com
export const passwordRegExp =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}$/; // Abcde123#
export const passwordMinLength = 6;
export const passwordMaxLength = 32;

export const userParametrs = {
  usersGoal: ['Lose Fat', 'Maintain', 'Gain Muscle'],
  userSex: ['male', 'female'],
  minHeight: 150,
  minDesiredWeight: 35,
  levelActivityTypes: [1, 2, 3, 4, 5],
  activityIndex: {
    1: 1.2,
    2: 1.375,
    3: 1.55,
    4: 1.725,
    5: 1.9,
  },
};
