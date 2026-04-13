export type AccountRole = "MASTER" | "OPERATOR";
export type AccountStatus = "ACTIVE" | "INACTIVE" | "LOCKED";

export type Account = {
  id: string;
  name: string;
  role: AccountRole;
  status: AccountStatus;
  registeredAt: string;
  lastLoginAt: string | null;
};

export type AccountLoginHistory = {
  id: string;
  occurredAt: string;
  success: boolean;
  ip: string;
};

export type AccountLockHistory = {
  id: string;
  type: "LOCKED" | "UNLOCKED";
  reason: string;
  actor: string;
  occurredAt: string;
};

export type AccountDetail = Account & {
  loginHistory: AccountLoginHistory[];
  lockHistory: AccountLockHistory[];
};

export type AccountStats = {
  total: number;
  masters: number;
  operators: number;
  inactive: number;
};

export type UserCandidate = {
  id: string;
  name: string;
  complexCode: string;
};
