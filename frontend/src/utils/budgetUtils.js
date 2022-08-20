export const transformBudgetData = (data) => {
  let output = {};
  data.map((item) => {
    output[item.category.id] = output[item.category.id] || {};
    output[item.category.id] = {
      ...output[item.category.id],
      parentId: item.category.parent,
      [item.month.id]: {
        id: item.id,
        initAmount: item.amount,
        amount: item.amount,
      },
    };
  });
  return output;
};

export const sumBudgetData = (budget, months, categories) => {
  categories = categories || [];
  let output = { budgetSum: {} };
  categories.map((category) => {
    months.map((month) => {
      let sum = 0;
      category.bucket.map((subcategory) => {
        if (
          budget.hasOwnProperty(subcategory.id) &&
          budget[subcategory.id].hasOwnProperty(month.id)
        ) {
          sum += parseInt(budget[subcategory.id][month.id].amount);
        }
      });
      output = {
        budgetSum: {
          ...output.budgetSum,
          [category.id]: {
            ...output.budgetSum[category.id],
            [month.id]: sum,
          },
        },
      };
    });
  });
  return output;
};
