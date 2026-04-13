import type { FeedbackFilters, FeedbackReaction } from "@/types/feedback";

export const FEEDBACK_REACTION_LABELS: Record<FeedbackReaction, string> = {
  POSITIVE: "긍정",
  NEGATIVE: "부정"
};

export const FEEDBACK_FILTER_OPTIONS: Array<{ label: string; value: FeedbackFilters["reaction"] }> = [
  { label: "전체", value: "ALL" },
  { label: "긍정", value: "POSITIVE" },
  { label: "부정", value: "NEGATIVE" }
];
