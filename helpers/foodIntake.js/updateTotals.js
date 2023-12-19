export const updateIntakeTotals = async intake => {
  const sections = ['breakfast', 'lunch', 'dinner', 'snack'];

  let totalAllCalories = 0;
  let totalAllFat = 0;
  let totalAllProtein = 0;
  let totalAllCarbs = 0;

  for (const section of sections) {
    const products = intake[section].products;

    const total = products.reduce(
      (acc, curr) => {
        acc.totalCalories += curr.calories || 0;
        acc.totalFat += curr.fat || 0;
        acc.totalCarbonohidretes += curr.carbonohidretes || 0;
        acc.totalProtein += curr.protein || 0;
        return acc;
      },
      {
        totalCalories: 0,
        totalFat: 0,
        totalCarbonohidretes: 0,
        totalProtein: 0,
      },
    );

    intake[section].totalCalories = total.totalCalories;
    intake[section].totalFat = total.totalFat;
    intake[section].totalCarbonohidretes = total.totalCarbonohidretes;
    intake[section].totalProtein = total.totalProtein;

    // Суммируем общее количество калорий, жиров, белков и углеводов из каждого раздела
    totalAllCalories += total.totalCalories;
    totalAllFat += total.totalFat;
    totalAllProtein += total.totalProtein;
    totalAllCarbs += total.totalCarbonohidretes;
  }

  // Записываем общие суммы в основной объект
  intake.totalCalories = totalAllCalories;
  intake.totalFat = totalAllFat;
  intake.totalProtein = totalAllProtein;
  intake.totalCarbonohidretes = totalAllCarbs;

  await intake.save();
};
