import type { TimeRange } from "@/types/dashboard";

export const DASHBOARD_RANGE_LABELS: Record<TimeRange, { label: string; note: string }> = {
  DAY: {
    label: "일간",
    note: "오늘 기준 7일"
  },
  WEEK: {
    label: "주간",
    note: "이번주 기준 7주"
  },
  MONTH: {
    label: "월간",
    note: "이번달 기준 7달"
  }
};

export const DASHBOARD_TIME_RANGES: TimeRange[] = ["DAY", "WEEK", "MONTH"];
