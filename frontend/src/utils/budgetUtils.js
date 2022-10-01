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
    const budgetTotal = parseInt(
      output[item.category.parent]?.months?.[item.month.id]?.budgetTotal || 0
    );
    const newBudgetTotal = budgetTotal + parseInt(item.budgetSum || 0);

    const transactionTotal = parseInt(
      output[item.category.parent]?.months?.[item.month.id]?.transactionTotal ||
        0
    );
    const newTransactionTotal =
      transactionTotal + parseInt(item.transactionAmount || 0);

    output[item.category.id] = output[item.category.id] || {};
    output = {
      ...output,
      [item.category.parent]: {
        ...output[item.category.parent],
        subcategories: {
          ...output[item.category.parent]?.subcategories,
          [item.category.id]: {
            ...output[item.category.parent]?.subcategories?.[item.category.id],
            [item.month.id]: {
              budgetAmount: item.budgetAmount,
              budgetSum: item.budgetSum,
              transactionAmount: item.transactionAmount,
              transactionSum: item.transactionSum,
            },
          },
        },
        months: {
          ...output[item.category.parent]?.months,
          [item.month.id]: {
            transactionTotal: newTransactionTotal,
            budgetTotal: newBudgetTotal,
          },
        },
      },
      months: {
        ...output.months,
        [item.month.id]: {
          income: item.income,
          expenditures: item.expenditures,
          leftToBudget: item.income - item.budgetAmount,
          budgetAmount: item.budgetAmount,
        },
      },
    };
  });
  return output;
};
