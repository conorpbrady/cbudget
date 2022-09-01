from django.db import connection

query_string = """
 ( SELECT mb.Month as Month, mb.Category as Category, SUM(mb.Amount) as BudgetAmount,
     SUM(t.amount) as TransactionAmount FROM MonthlyBudget as mb
     GROUP BY mb.Month, mb.Category
  LEFT JOIN Month as m WHERE m.id = mb.month /* Need FK relationship */
  LEFT JOIN Category as c WHERE c.id = mb.category
  LEFT JOIN Transactions as t WHERE t.month = m.id AND t.category = c.id ) as MonthSums;

  SELECT ms1.Month, ms1.Category, SUM(ms2.BudgetAmount) as BudgetCumSum,
      SUM(ms2.transactionAmount) as TransactionCumSum from MonthSums ms1
  INNER JOIN MonthSums ms2 on ms1.Month >= ms2.Month AND ms1.Category = ms2.Category
  GROUP BY ms1.Month, ms1.Category
"""

def execute_query():
    with connection.cursor() as cursor:
        cursor.execute(query_string)
        columns = [col[0] for col in cursor.description]
        return [
            dict(zip(columns, row))
            for row in cursor.fetchall()
            ]
print(execute_query())
