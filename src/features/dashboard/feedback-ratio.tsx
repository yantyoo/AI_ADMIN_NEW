"use client";

import { useMemo, useState } from "react";
import type { FeedbackReaction, FeedbackRatioData } from "@/types/dashboard";
import { SectionHeader } from "@/components/layout/section-header";
import { KeywordList } from "@/features/dashboard/keyword-list";
import { formatPercent } from "@/utils/text";

type FeedbackRatioProps = {
  data: FeedbackRatioData;
};

const reactionMeta: Record<FeedbackReaction, { label: string; tooltipLabel: string }> = {
  POSITIVE: {
    label: "만족해요",
    tooltipLabel: "만족해요"
  },
  NEGATIVE: {
    label: "아쉬워요",
    tooltipLabel: "아쉬워요"
  }
};

const VIEW_BOX = 100;
const CENTER = 50;
const OUTER_RADIUS = 42;
const INNER_RADIUS = 24;

const pointOnCircle = (cx: number, cy: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians)
  };
};

const describeDonutSlice = (startAngle: number, endAngle: number) => {
  const outerStart = pointOnCircle(CENTER, CENTER, OUTER_RADIUS, endAngle);
  const outerEnd = pointOnCircle(CENTER, CENTER, OUTER_RADIUS, startAngle);
  const innerStart = pointOnCircle(CENTER, CENTER, INNER_RADIUS, startAngle);
  const innerEnd = pointOnCircle(CENTER, CENTER, INNER_RADIUS, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    `M ${outerStart.x.toFixed(3)} ${outerStart.y.toFixed(3)}`,
    `A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 ${largeArcFlag} 0 ${outerEnd.x.toFixed(3)} ${outerEnd.y.toFixed(3)}`,
    `L ${innerStart.x.toFixed(3)} ${innerStart.y.toFixed(3)}`,
    `A ${INNER_RADIUS} ${INNER_RADIUS} 0 ${largeArcFlag} 1 ${innerEnd.x.toFixed(3)} ${innerEnd.y.toFixed(3)}`,
    "Z"
  ].join(" ");
};

export function FeedbackRatio({ data }: FeedbackRatioProps) {
  const [selectedReaction, setSelectedReaction] = useState<FeedbackReaction>(data.defaultReaction);
  const [hoveredReaction, setHoveredReaction] = useState<FeedbackReaction | null>(null);

  const positivePercent = (data.positive.count / data.totalCount) * 100;
  const negativePercent = (data.negative.count / data.totalCount) * 100;
  const positiveSlice = useMemo(
    () => describeDonutSlice(0, (data.positive.count / data.totalCount) * 360),
    [data.positive.count, data.totalCount]
  );
  const negativeSlice = useMemo(
    () => describeDonutSlice((data.positive.count / data.totalCount) * 360, 360),
    [data.positive.count, data.totalCount]
  );
  const hoveredSummary = hoveredReaction ? data[hoveredReaction === "POSITIVE" ? "positive" : "negative"] : null;
  const keywordTitle = `${reactionMeta[selectedReaction].label} TOP5 키워드`;

  return (
    <section className="panel panel--side feedback-ratio-card">
      <SectionHeader title="피드백 비율" className="feedback-ratio-card__header" />

      <div className="feedback-ratio">
        <div className="feedback-ratio__chart-shell">
          <svg
            className="feedback-ratio__chart"
            viewBox={`0 0 ${VIEW_BOX} ${VIEW_BOX}`}
            role="img"
            aria-label={`피드백 비율 도넛 차트. 만족해요 ${formatPercent(positivePercent)}, 아쉬워요 ${formatPercent(negativePercent)}`}
          >
            <path
              d={positiveSlice}
              className="feedback-ratio__slice feedback-ratio__slice--positive"
              onMouseEnter={() => setHoveredReaction("POSITIVE")}
              onMouseLeave={() => setHoveredReaction(null)}
              onFocus={() => setHoveredReaction("POSITIVE")}
              onBlur={() => setHoveredReaction(null)}
              tabIndex={0}
            />
            <path
              d={negativeSlice}
              className="feedback-ratio__slice feedback-ratio__slice--negative"
              onMouseEnter={() => setHoveredReaction("NEGATIVE")}
              onMouseLeave={() => setHoveredReaction(null)}
              onFocus={() => setHoveredReaction("NEGATIVE")}
              onBlur={() => setHoveredReaction(null)}
              tabIndex={0}
            />
            <circle cx={CENTER} cy={CENTER} r={INNER_RADIUS} className="feedback-ratio__hole" />
            <text x="50" y="46" textAnchor="middle" className="feedback-ratio__center-label">
              전체 건수
            </text>
            <text x="50" y="60" textAnchor="middle" className="feedback-ratio__center-value">
              {data.totalCount.toLocaleString()}건
            </text>
          </svg>

          {hoveredSummary ? (
            <div className="feedback-ratio__tooltip" aria-live="polite">
              <span className="feedback-ratio__tooltip-label">
                {reactionMeta[hoveredReaction as FeedbackReaction].tooltipLabel}
              </span>
              <strong>
                {hoveredSummary.count.toLocaleString()}건 · {formatPercent(hoveredSummary.ratio)}
              </strong>
            </div>
          ) : null}
        </div>

        <div className="feedback-toggle" role="tablist" aria-label="피드백 유형">
          {(["POSITIVE", "NEGATIVE"] as FeedbackReaction[]).map((reaction) => {
            const isSelected = reaction === selectedReaction;

            return (
              <button
                key={reaction}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`feedback-toggle__button${isSelected ? " is-selected" : ""}`}
                onClick={() => setSelectedReaction(reaction)}
              >
                {reactionMeta[reaction].label}
              </button>
            );
          })}
        </div>

        <KeywordList
          title={keywordTitle}
          items={selectedReaction === "POSITIVE" ? data.positive.keywords : data.negative.keywords}
          bare
        />
      </div>
    </section>
  );
}
