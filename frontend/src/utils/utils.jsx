export function splitMonthCatId(monthCatString) {
   return monthCatString
      .split('-')
      .map((s) => s.substring(1));
}

export const getCurrentMonth = () => {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).substring(2,)
  return mm + yy
}
