export const calculateMacros = (user, dailyGoalCalories) => {
  const { goal } = user;
  let proteinPercentage, fatPercentage, carbPercentage;

  switch (goal) {
    case 'Lose Fat':
      proteinPercentage = 0.25;
      fatPercentage = 0.2;
      break;
    case 'Maintain':
      proteinPercentage = 0.3;
      fatPercentage = 0.2;
      break;
    case 'Gain Muscle':
      proteinPercentage = 0.2;
      fatPercentage = 0.25;
      break;
    default:
      proteinPercentage = 0.25;
      fatPercentage = 0.2;
  }

  carbPercentage = 1 - (proteinPercentage + fatPercentage);

  const protein = Math.round((proteinPercentage * dailyGoalCalories) / 4);
  const fat = Math.round((fatPercentage * dailyGoalCalories) / 9);
  const carbonohidrates = Math.round((carbPercentage * dailyGoalCalories) / 4);

  return { protein, fat, carbonohidrates };
};
