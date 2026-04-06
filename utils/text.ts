export const normalizeSearchText = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/[^0-9a-z가-힣]/gi, "");

export const compareStringDesc = (left: string, right: string) => right.localeCompare(left);

export const formatPercent = (value: number) =>
  Number.isInteger(value) ? `${value}%` : `${value.toFixed(1)}%`;
