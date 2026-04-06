import type { AccountDetail } from "@/types/accounts";

export const CURRENT_ACCOUNT_ID = "chat1004";

export const ACCOUNT_STATUS_LABELS: Record<AccountDetail["status"], string> = {
  ACTIVE: "활성",
  INACTIVE: "비활성",
  LOCKED: "잠금"
};

export const ACCOUNT_ROLE_LABELS: Record<AccountDetail["role"], string> = {
  MASTER: "MASTER",
  OPERATOR: "OPERATOR"
};

export const ACCOUNT_ACTION_TITLES = {
  ACTIVATE: "권한 복구",
  DEACTIVATE: "권한 비활성화",
  UNLOCK: "잠금 해제"
} as const;

export const ACCOUNT_TOAST_DISMISS_MS = 3000;
