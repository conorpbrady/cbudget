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

export const transformSumData = (data) => {
  let output = {};
  data.map((item) => {
    output[item.category] = output[item.category] || {};
    output[item.category] = {
      ...output[item.category],
      [item.month]: {
        amount: item.amount,
      },
    };
  });
  return output;
};

export const transformTransactionSumData = (data) => {
  let output = {};
  let parentSum = {};

  data.map((item) => {

    const currentSum = parseInt(output[item.category.parent]?.amount) || 0;
    const newSum = currentSum + parseInt(item.amount);
    output = {
      ...output,
      [item.category.parent]: {
        ...output[item.category.parent],
        [item.category.id]: {
          ...output[item.category.parent]?.[item.category.id],
          [item.month.id]: { amount: item.amount },
        },
        amount: newSum,
      },
    };
  });
  return output;
};
/*
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
*/
