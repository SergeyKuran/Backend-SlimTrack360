const activityIndex = {
  1: 1.2,
  2: 1.375,
  3: 1.55,
  4: 1.725,
  5: 1.9,
};

export const dayNormaWater = user => {
  const { levelActivity, currentWeight } = user;

  if (levelActivity in activityIndex) {
    const activeIndex = activityIndex[levelActivity];

    switch (activeIndex) {
      case 1.2:
        return Number((currentWeight * 0.03).toFixed(1));
      case 1.375:
        return Number((currentWeight * 0.03 + 0.35).toFixed(1));
      case 1.55:
        return Number((currentWeight * 0.03 + 0.35).toFixed(1));
      case 1.725:
        return Number((currentWeight * 0.03 + 0.35).toFixed(1));
      case 1.9:
        return Number((currentWeight * 0.03 + 0.7).toFixed(1));

      default:
        break;
    }
  }
};
