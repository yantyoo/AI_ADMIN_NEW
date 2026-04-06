export type FeedbackReaction = "POSITIVE" | "NEGATIVE";
export type FeedbackPeriod = "DAY" | "WEEK" | "MONTH";

export type FeedbackItem = {
  id: string;
  complexName: string;
  userId: string;
  reaction: FeedbackReaction;
  hasNegativeReason: boolean;
  createdAt: string;
};

export type FeedbackConversationTurn = {
  speaker: "USER" | "BOT";
  message: string;
  sentAt: string;
};

export type FeedbackDetail = FeedbackItem & {
  conversation: FeedbackConversationTurn[];
  negativeReason: string | null;
};

export type FeedbackFilters = {
  reaction: FeedbackReaction | "ALL";
};
