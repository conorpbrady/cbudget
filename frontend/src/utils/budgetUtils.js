export const getMonthId = (months, monthShortName) => {
  return new Promise((resolve, reject) => {
    if (months === undefined || months.length < 1) {
      return reject('Month data has not been populated');
    }
    Object.keys(months).map((monthId) => {
      if (months[monthId].short_name === monthShortName) {
        return resolve(months[monthId].id);
      }
    });
    return reject('Month not found in month data');
  });
};

// Creates a string of comma-separated consecutive integers
// given a starting value and length
// e.g. (5, 3) => "5,6,7"
export const createMonthString = (start, length) => {
  return Array(length).fill(start).map((v, i) => v + i).join(',')
}

export const getMonthsInWindow = (months, currentMonth, range) => {
  let output = [];
  let currentMonthId = -1;

  Object.keys(months).map((monthId) => {
    if (months[monthId].short_name === currentMonth) {
      currentMonthId = parseInt(months[monthId].id);
    }
    if (
      currentMonthId > 0 &&
      months[monthId].id >= currentMonthId &&
      months[monthId].id < parseInt(currentMonthId + range)
    ) {
      output.push(months[monthId]);
    }
  });
  return { output, currentMonthId };
};

export const transformMonthData = (data) => {
  let output = {};
  data.map((item) => {
    output = {
      ...output,
      [item.id]: item,
    };
  });
  return output;
};

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
    const expendituresTotal = parseInt(
      output.months?.[item.month.id]?.expenditures || 0
    );
    const newExpendituresTotal =
      expendituresTotal + parseInt(item.expenditures || 0);
    const monthIncomeTotal = parseInt(
      output.months?.[item.month.id]?.income || 0
    );
    const newIncomeTotal = monthIncomeTotal + parseInt(item.income || 0);

    const monthBudgetTotal = parseInt(
      output.months?.[item.month.id]?.budgetAmount || 0
    );
    const newMonthBudgetTotal =
      monthBudgetTotal + parseInt(item.budgetAmount || 0);

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
          income: newIncomeTotal,
          expenditures: newExpendituresTotal,
          leftToBudget: newIncomeTotal - newMonthBudgetTotal,
          budgetAmount: newMonthBudgetTotal,
        },
      },
    };
  });
  return output;
};
