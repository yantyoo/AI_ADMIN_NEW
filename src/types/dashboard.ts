export type TimeRange = "DAY" | "WEEK" | "MONTH";

export type ComparisonDirection = "UP" | "DOWN";

export type MetricCardData = {
  key: "visitors" | "inquiries" | "failures";
  label: string;
  value: number;
  compareLabel: string;
  compareRate: number;
  compareDirection: ComparisonDirection;
};

export type TrendPoint = {
  label: string;
  dateLabel: string;
  visitors: number;
  inquiries: number;
};

export type KeywordItem = {
  rank: number;
  label: string;
  count: number;
  ratio: number;
};

export type FeedbackReaction = "POSITIVE" | "NEGATIVE";

export type FeedbackReactionSummary = {
  count: number;
  ratio: number;
  keywords: KeywordItem[];
};

export type FeedbackRatioData = {
  totalCount: number;
  defaultReaction: FeedbackReaction;
  positive: FeedbackReactionSummary;
  negative: FeedbackReactionSummary;
};

export type DashboardPayload = {
  selectedRange: TimeRange;
  metrics: MetricCardData[];
  trend: TrendPoint[];
  fixedKeywords: KeywordItem[];
  fixedFeedbackRatio: FeedbackRatioData;
};
