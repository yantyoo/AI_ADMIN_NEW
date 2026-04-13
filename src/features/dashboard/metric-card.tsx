import type { MetricCardData } from "@/types/dashboard";

type MetricCardProps = {
  metric: MetricCardData;
};

export function MetricCard({ metric }: MetricCardProps) {
  const ratePrefix = metric.compareDirection === "UP" ? "+" : "-";
  const rateClass = metric.compareDirection === "UP" ? "is-up" : "is-down";

  return (
    <article className="metric-card">
      <div className="metric-card__label">{metric.label}</div>
      <div className="metric-card__value">{metric.value.toLocaleString()}건</div>
      <div className={`metric-card__compare ${rateClass}`}>
        <strong>
          {ratePrefix} {metric.compareRate}%
        </strong>
        <span>{metric.compareLabel}</span>
      </div>
    </article>
  );
}
