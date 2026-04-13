import type { CacheQaFilters, CacheQaForm, CacheQaStatus } from "@/types/cache-qa";

export const CACHE_QA_PAGE_SIZE = 10;
export const CACHE_QA_QUESTION_MAX_LENGTH = 500;
export const CACHE_QA_ANSWER_MAX_LENGTH = 2000;
export const CACHE_QA_TOAST_DISMISS_MS = 3000;

export const CACHE_QA_STATUS_LABELS: Record<CacheQaStatus, string> = {
  ACTIVE: "활성",
  INACTIVE: "비활성"
};

export const CACHE_QA_STATUS_OPTIONS: Array<{ label: string; value: CacheQaFilters["status"] }> = [
  { label: "전체", value: "ALL" },
  { label: "활성", value: "ACTIVE" },
  { label: "비활성", value: "INACTIVE" }
];

export const DEFAULT_CACHE_QA_FORM: CacheQaForm = {
  question: "",
  answer: "",
  status: "ACTIVE"
};
