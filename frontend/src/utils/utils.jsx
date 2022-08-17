export function splitMonthCatId(monthCatString) {
   return monthCatString
      .split('-')
      .map((s) => s.substring(1));
}

