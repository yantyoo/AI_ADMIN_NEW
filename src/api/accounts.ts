import type { AccountDetail, AccountStats, UserCandidate } from "@/types/accounts";

const accountDetails: AccountDetail[] = [
  {
    id: "chat1004",
    name: "박운영",
    role: "MASTER",
    status: "ACTIVE",
    registeredAt: "2025-06-01",
    lastLoginAt: "2026-04-02 08:45",
    loginHistory: [
      { id: "lh-001", occurredAt: "2026-04-02 08:45", success: true, ip: "192.168.1.10" },
      { id: "lh-002", occurredAt: "2026-04-01 09:12", success: true, ip: "192.168.1.10" },
    ],
    lockHistory: [],
  },
  {
    id: "op2031",
    name: "김관리",
    role: "OPERATOR",
    status: "ACTIVE",
    registeredAt: "2025-09-15",
    lastLoginAt: "2026-04-01 14:30",
    loginHistory: [
      { id: "lh-003", occurredAt: "2026-04-01 14:30", success: true, ip: "10.0.0.5" },
      { id: "lh-004", occurredAt: "2026-03-31 10:00", success: false, ip: "10.0.0.5" },
    ],
    lockHistory: [],
  },
  {
    id: "op3044",
    name: "이운영",
    role: "OPERATOR",
    status: "INACTIVE",
    registeredAt: "2025-11-20",
    lastLoginAt: "2026-03-10 17:00",
    loginHistory: [
      { id: "lh-005", occurredAt: "2026-03-10 17:00", success: true, ip: "172.16.0.2" },
    ],
    lockHistory: [
      {
        id: "lkh-001",
        type: "UNLOCKED",
        reason: "본인 요청 해제",
        actor: "chat1004",
        occurredAt: "2026-03-10 16:55",
      },
      {
        id: "lkh-002",
        type: "LOCKED",
        reason: "OTP 5회 실패",
        actor: "SYSTEM",
        occurredAt: "2026-03-10 16:50",
      },
    ],
  },
  {
    id: "op4099",
    name: "최보안",
    role: "OPERATOR",
    status: "LOCKED",
    registeredAt: "2026-01-05",
    lastLoginAt: null,
    loginHistory: [],
    lockHistory: [
      {
        id: "lkh-003",
        type: "LOCKED",
        reason: "OTP 5회 실패",
        actor: "SYSTEM",
        occurredAt: "2026-04-01 09:30",
      },
    ],
  },
];

export const userCandidates: UserCandidate[] = [
  { id: "emp001", name: "정수진", complexCode: "COMPLEX-101" },
  { id: "emp002", name: "박현준", complexCode: "COMPLEX-205" },
  { id: "emp003", name: "한지원", complexCode: "COMPLEX-310" },
];

export function computeAccountStats(accounts: AccountDetail[]): AccountStats {
  return {
    total: accounts.filter((a) => a.status === "ACTIVE").length,
    masters: accounts.filter((a) => a.role === "MASTER" && a.status === "ACTIVE").length,
    operators: accounts.filter((a) => a.role === "OPERATOR" && a.status === "ACTIVE").length,
    inactive: accounts.filter((a) => a.status !== "ACTIVE").length,
  };
}

export async function getAccountsData(): Promise<{
  accounts: AccountDetail[];
  stats: AccountStats;
}> {
  const stats = computeAccountStats(accountDetails);
  return { accounts: accountDetails, stats };
}
