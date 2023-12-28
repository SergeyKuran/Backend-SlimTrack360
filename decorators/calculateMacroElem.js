export const calculateMacros = (user, dailyGoalCalories) => {
  const { goal } = user;
  let proteinPercentage, fatPercentage, carbPercentage;

  switch (goal) {
    case 'Lose Fat':
      proteinPercentage = 0.25;
      fatPercentage = 0.2;
      break;
    case 'Maintain':
      proteinPercentage = 0.2;
      fatPercentage = 0.25;
      break;
    case 'Gain Muscle':
      proteinPercentage = 0.3;
      fatPercentage = 0.2;
      break;
    default:
      proteinPercentage = 0.25;
      fatPercentage = 0.2;
  }

  carbPercentage = 1 - (proteinPercentage + fatPercentage);

  const protein = Math.round(proteinPercentage * dailyGoalCalories);
  const fat = Math.round(fatPercentage * dailyGoalCalories);
  const carbonohidrates = Math.round(carbPercentage * dailyGoalCalories);

  return { protein, fat, carbonohidrates };
};
