import type { TimeRange } from "@/types/dashboard";

export const dashboardRangeLabels: Record<
  TimeRange,
  { label: string; helper: string; axisLabel: string }
> = {
  DAY: {
    label: "7일",
    helper: "7일 기준",
    axisLabel: "7일"
  },
  WEEK: {
    label: "7주",
    helper: "7주 기준",
    axisLabel: "7주"
  },
  MONTH: {
    label: "7달",
    helper: "7달 기준",
    axisLabel: "7달"
  }
};
