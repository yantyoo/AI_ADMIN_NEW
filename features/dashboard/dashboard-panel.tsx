"use client";

import { useState } from "react";
import { dashboardMockByRange } from "@/api/dashboard";
import type { DashboardPayload, TimeRange } from "@/types/dashboard";
import { dashboardRangeLabels } from "@/features/dashboard/range-config";
import { ErrorState } from "@/features/dashboard/error-state";
import { FeedbackRatio } from "@/features/dashboard/feedback-ratio";
import { KeywordList } from "@/features/dashboard/keyword-list";
import { MetricCard } from "@/features/dashboard/metric-card";
import { SectionHeader } from "@/features/dashboard/section-header";
import { TimeRangeTabs } from "@/features/dashboard/time-range-tabs";
import { TrendChart } from "@/features/dashboard/trend-chart";

type DashboardPanelProps = {
  data: DashboardPayload;
};

export function DashboardPanel({ data }: DashboardPanelProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>(data.selectedRange);
  const [showError, setShowError] = useState(false);
  const selectedData = dashboardMockByRange[selectedRange];
  const selectedLabel = dashboardRangeLabels[selectedRange];

  return (
    <div className="dashboard-grid">
      <section className="panel panel--main">
        <SectionHeader
          title="기간별 질문 현황"
          subtitle="선택한 기간의 접속자 수와 문의 수를 함께 확인합니다."
          actions={
            <>
              <span className="panel__range-label">{selectedLabel.helper}</span>
              <TimeRangeTabs value={selectedRange} onChange={setSelectedRange} />
            </>
          }
        />

        {showError ? (
          <ErrorState onRetry={() => setShowError(false)} />
        ) : (
          <>
            <div className="metric-card-grid">
              {selectedData.metrics.map((metric) => (
                <MetricCard key={metric.key} metric={metric} />
              ))}
            </div>

            <TrendChart points={selectedData.trend} rangeLabel={selectedLabel.axisLabel} />
          </>
        )}
      </section>

      <section className="dashboard-side">
        <KeywordList title="질문 키워드" rangeLabel="오늘 기준 7일" items={data.fixedKeywords} />
        <FeedbackRatio data={data.fixedFeedbackRatio} />
      </section>
    </div>
  );
}
