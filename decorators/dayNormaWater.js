const activityIndex = {
  1: 1.2,
  2: 1.375,
  3: 1.55,
  4: 1.725,
  5: 1.9,
};

export const dayNormaWater = (levelActivity, currentWeight) => {
  if (levelActivity in activityIndex) {
    const activeIndex = activityIndex[levelActivity];

    switch (activeIndex) {
      case 1.2:
        return currentWeight * 0.03;
      case 1.375:
        return currentWeight * 0.03 + 0.35;
      case 1.55:
        return currentWeight * 0.03 + 0.35;
      case 1.725:
        return currentWeight * 0.03 + 0.35;
      case 1.9:
        return currentWeight * 0.03 + 0.7;

      default:
        break;
    }
  }
};
