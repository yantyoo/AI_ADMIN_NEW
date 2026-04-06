"use client";

import { useMemo, useState } from "react";
import type { MouseEvent } from "react";
import type { TrendPoint } from "@/types/dashboard";

type TrendChartProps = {
  points: TrendPoint[];
};

type TooltipState = {
  point: TrendPoint;
  left: number;
  top: number;
} | null;

const width = 760;
const height = 340;
const padding = 32;
const barWidth = 24;
const barRadius = 5;

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const buildTopRoundedBarPath = (x: number, y: number, rectWidth: number, rectHeight: number) => {
  const safeHeight = Math.max(rectHeight, 0);
  const safeRadius = Math.min(barRadius, rectWidth / 2, safeHeight / 2);

  if (!safeHeight) {
    return "";
  }

  if (safeRadius === 0) {
    return `M ${x} ${y} H ${x + rectWidth} V ${y + safeHeight} H ${x} Z`;
  }

  return [
    `M ${x} ${y + safeHeight}`,
    `V ${y + safeRadius}`,
    `Q ${x} ${y} ${x + safeRadius} ${y}`,
    `H ${x + rectWidth - safeRadius}`,
    `Q ${x + rectWidth} ${y} ${x + rectWidth} ${y + safeRadius}`,
    `V ${y + safeHeight}`,
    "Z"
  ].join(" ");
};

export function TrendChart({ points }: TrendChartProps) {
  const [tooltip, setTooltip] = useState<TooltipState>(null);

  const visitorMax = Math.max(...points.map((point) => point.visitors), 1);
  const inquiryMax = Math.max(...points.map((point) => point.inquiries), 1);
  const maxValue = Math.max(visitorMax, inquiryMax);
  const ySpan = maxValue || 1;

  const coords = useMemo(() => {
    return points.map((point, index) => {
      const x = padding + (index * (width - padding * 2)) / Math.max(points.length - 1, 1);
      const visitorY = height - padding - (point.visitors / ySpan) * (height - padding * 2);
      const inquiryY = height - padding - (point.inquiries / ySpan) * (height - padding * 2);

      return { ...point, x, visitorY, inquiryY };
    });
  }, [points, ySpan]);

  const linePath = coords.map((coord, index) => `${index === 0 ? "M" : "L"} ${coord.x} ${coord.inquiryY}`).join(" ");

  const updateTooltip = (event: MouseEvent<SVGElement>, point: TrendPoint) => {
    const svgRect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();

    if (!svgRect) {
      return;
    }

    const rawLeft = event.clientX - svgRect.left + 14;
    const rawTop = event.clientY - svgRect.top - 14;
    const left = clamp(rawLeft, 12, Math.max(svgRect.width - 208, 12));
    const top = clamp(rawTop, 12, Math.max(svgRect.height - 104, 12));

    setTooltip({ point, left, top });
  };

  if (!coords.length) {
    return (
      <div className="trend-chart trend-chart--empty">
        <div className="trend-chart__empty">표시할 차트 데이터가 없습니다.</div>
        <div className="trend-chart__legend">
          <span className="trend-chart__legend-item">
            <span className="trend-chart__legend-dot trend-chart__legend-dot--bar" />
            <span>접속자 수</span>
          </span>
          <span className="trend-chart__legend-item">
            <span className="trend-chart__legend-dot" />
            <span>문의 수</span>
          </span>
        </div>
      </div>
    );
  }

  const tooltipPoint = tooltip?.point;

  return (
    <div className="trend-chart">
      <div className="trend-chart__stage">
        <svg viewBox={`0 0 ${width} ${height}`} className="trend-chart__svg" role="img">
          {[0, 1, 2, 3, 4].map((index) => {
            const y = padding + (index * (height - padding * 2)) / 4;

            return (
              <line
                key={index}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                className="trend-chart__grid"
              />
            );
          })}

          {coords.map((coord) => {
            const barX = coord.x - barWidth / 2;
            const barHeight = height - padding - coord.visitorY;
            const barPath = buildTopRoundedBarPath(barX, coord.visitorY, barWidth, barHeight);

            return (
              <g
                key={`${coord.label}-bar`}
                className="trend-chart__bar-group"
                onMouseEnter={(event) => updateTooltip(event, coord)}
                onMouseMove={(event) => updateTooltip(event, coord)}
                onMouseLeave={() => setTooltip(null)}
              >
                <path d={barPath} className="trend-chart__bar" />
                <rect
                  x={barX - 4}
                  y={coord.visitorY}
                  width={barWidth + 8}
                  height={barHeight}
                  fill="transparent"
                  className="trend-chart__bar-hitarea"
                />
                <text x={coord.x} y={height - 8} textAnchor="middle" className="trend-chart__label">
                  {coord.label}
                </text>
              </g>
            );
          })}

          <path d={linePath} className="trend-chart__path" />

          {coords.map((coord) => (
            <g
              key={coord.label}
              className="trend-chart__point-group"
              onMouseEnter={(event) => updateTooltip(event, coord)}
              onMouseMove={(event) => updateTooltip(event, coord)}
              onMouseLeave={() => setTooltip(null)}
            >
              <circle cx={coord.x} cy={coord.inquiryY} r="5" className="trend-chart__point" />
              <circle cx={coord.x} cy={coord.inquiryY} r="10" fill="transparent" />
            </g>
          ))}
        </svg>

        {tooltipPoint && tooltip ? (
          <div
            className="trend-chart__tooltip"
            style={{ left: tooltip.left, top: tooltip.top }}
            aria-live="polite"
          >
            <span className="trend-chart__tooltip-date">{tooltipPoint.dateLabel}</span>
            <strong>{tooltipPoint.visitors.toLocaleString()} 접속자</strong>
            <span>{tooltipPoint.inquiries.toLocaleString()} 문의</span>
          </div>
        ) : null}
      </div>

      <div className="trend-chart__legend">
        <span className="trend-chart__legend-item">
          <span className="trend-chart__legend-dot trend-chart__legend-dot--bar" />
          <span>접속자 수</span>
        </span>
        <span className="trend-chart__legend-item">
          <span className="trend-chart__legend-dot" />
          <span>문의 수</span>
        </span>
      </div>
    </div>
  );
}
