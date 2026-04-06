export type DateRange = {
  startDate: string;
  endDate: string;
};

export const toLocalDate = (value: string) => new Date(value.replace(" ", "T"));

export const startOfDayIso = (value: string) => `${value}T00:00:00`;

export const endOfDayIso = (value: string) => `${value}T23:59:59.999`;

export const isWithinDateRange = (value: string, range: DateRange) => {
  if (!range.startDate && !range.endDate) {
    return true;
  }

  const dateValue = toLocalDate(value).getTime();
  const startValue = range.startDate ? toLocalDate(startOfDayIso(range.startDate)).getTime() : null;
  const endValue = range.endDate ? toLocalDate(endOfDayIso(range.endDate)).getTime() : null;

  if (startValue !== null && endValue !== null && startValue > endValue) {
    return dateValue >= endValue && dateValue <= startValue;
  }

  if (startValue !== null && dateValue < startValue) {
    return false;
  }

  if (endValue !== null && dateValue > endValue) {
    return false;
  }

  return true;
};
