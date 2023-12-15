export const calculateMacros = (goal, calories) => {
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

  const Protein = Math.round((proteinPercentage * calories) / 4);
  const Fat = Math.round((fatPercentage * calories) / 9);
  const Carbonohidrates = Math.round((carbPercentage * calories) / 4);

  return { Protein, Fat, Carbonohidrates };
};
