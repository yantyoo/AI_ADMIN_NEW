export type CacheQaStatus = "ACTIVE" | "INACTIVE";

export type CacheQaFilters = {
  keyword: string;
  status: "ALL" | CacheQaStatus;
};

export type CacheQaForm = {
  question: string;
  answer: string;
  status: CacheQaStatus;
};

export type CacheQaItem = {
  id: string;
  question: string;
  answer: string;
  status: CacheQaStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  hitCount: number;
  lastMatchedAt: string | null;
};

export type CacheQaMatch = {
  item: CacheQaItem;
  score: number;
};
