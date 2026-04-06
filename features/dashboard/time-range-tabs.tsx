"use client";

import type { TimeRange } from "@/types/dashboard";
import { DASHBOARD_RANGE_LABELS, DASHBOARD_TIME_RANGES } from "@/constants/dashboard";

type TimeRangeTabsProps = {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
};

export function TimeRangeTabs({ value, onChange }: TimeRangeTabsProps) {
  return (
    <div className="time-range-tabs" role="tablist" aria-label="기간 선택">
      {DASHBOARD_TIME_RANGES.map((range) => {
        const isSelected = range === value;

        return (
          <button
            key={range}
            type="button"
            className={`time-range-tabs__button${isSelected ? " is-selected" : ""}`}
            onClick={() => onChange(range)}
          >
            {DASHBOARD_RANGE_LABELS[range].label}
          </button>
        );
      })}
    </div>
  );
}
