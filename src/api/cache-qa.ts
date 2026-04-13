import type { CacheQaForm, CacheQaItem, CacheQaMatch, CacheQaStatus } from "@/types/cache-qa";

const nowStamp = () => new Date().toLocaleString("sv-SE").slice(0, 16).replace("T", " ");

export const cacheQaSeed: CacheQaItem[] = [
  {
    id: "cache-001",
    question: "배송은 언제 도착하나요?",
    answer: "일반 배송은 결제 완료 후 2~3영업일 내 도착합니다. 지역과 상품에 따라 차이가 있습니다.",
    status: "ACTIVE",
    createdAt: "2026-04-01 09:10",
    updatedAt: "2026-04-02 11:40",
    createdBy: "관리자",
    updatedBy: "관리자",
    hitCount: 182,
    lastMatchedAt: "2026-04-03 09:18"
  },
  {
    id: "cache-002",
    question: "주문을 취소하고 싶어요",
    answer: "배송 전 주문은 마이페이지에서 직접 취소할 수 있습니다. 배송 후에는 반품 절차로 진행됩니다.",
    status: "ACTIVE",
    createdAt: "2026-04-01 10:22",
    updatedAt: "2026-04-03 08:12",
    createdBy: "관리자",
    updatedBy: "관리자",
    hitCount: 145,
    lastMatchedAt: "2026-04-03 09:40"
  },
  {
    id: "cache-003",
    question: "비밀번호를 재설정하려면 어떻게 하나요?",
    answer: "로그인 화면의 비밀번호 찾기 버튼을 눌러 등록된 이메일 또는 휴대폰 인증 후 재설정할 수 있습니다.",
    status: "ACTIVE",
    createdAt: "2026-04-01 13:05",
    updatedAt: "2026-04-02 15:55",
    createdBy: "운영팀",
    updatedBy: "운영팀",
    hitCount: 96,
    lastMatchedAt: "2026-04-03 08:05"
  },
  {
    id: "cache-004",
    question: "환불은 얼마나 걸리나요?",
    answer: "환불 승인 후 카드사 및 결제수단에 따라 3~7영업일이 소요됩니다.",
    status: "ACTIVE",
    createdAt: "2026-04-01 15:18",
    updatedAt: "2026-04-01 15:18",
    createdBy: "운영팀",
    updatedBy: "운영팀",
    hitCount: 74,
    lastMatchedAt: "2026-04-03 07:55"
  },
  {
    id: "cache-005",
    question: "회원 탈퇴는 어디서 하나요?",
    answer: "마이페이지 > 계정 설정 > 회원 탈퇴에서 진행할 수 있습니다. 탈퇴 후 복구는 불가합니다.",
    status: "INACTIVE",
    createdAt: "2026-03-30 11:30",
    updatedAt: "2026-04-02 10:30",
    createdBy: "관리자",
    updatedBy: "운영팀",
    hitCount: 61,
    lastMatchedAt: "2026-04-02 14:20"
  },
  {
    id: "cache-006",
    question: "영수증을 다시 받을 수 있나요?",
    answer: "주문 상세 화면에서 영수증 재발급을 눌러 이메일로 다시 받을 수 있습니다.",
    status: "ACTIVE",
    createdAt: "2026-03-29 09:45",
    updatedAt: "2026-04-02 09:10",
    createdBy: "관리자",
    updatedBy: "관리자",
    hitCount: 53,
    lastMatchedAt: "2026-04-03 07:12"
  },
  {
    id: "cache-007",
    question: "쿠폰은 어디서 적용하나요?",
    answer: "결제 단계의 쿠폰 입력란에서 보유 쿠폰을 선택하거나 쿠폰 코드를 입력할 수 있습니다.",
    status: "ACTIVE",
    createdAt: "2026-03-28 16:00",
    updatedAt: "2026-04-02 12:00",
    createdBy: "운영팀",
    updatedBy: "운영팀",
    hitCount: 117,
    lastMatchedAt: "2026-04-03 06:58"
  },
  {
    id: "cache-008",
    question: "주문 조회가 안 돼요",
    answer: "주문 번호와 연락처가 일치하는지 확인해 주세요. 그래도 조회되지 않으면 고객센터에 문의해 주세요.",
    status: "ACTIVE",
    createdAt: "2026-03-28 18:20",
    updatedAt: "2026-04-01 16:05",
    createdBy: "관리자",
    updatedBy: "관리자",
    hitCount: 88,
    lastMatchedAt: "2026-04-03 09:00"
  },
  {
    id: "cache-009",
    question: "배송 주소를 수정하고 싶어요",
    answer: "결제 완료 직후에는 주문 상세에서 주소 수정이 가능하며, 출고 이후에는 수정이 불가합니다.",
    status: "INACTIVE",
    createdAt: "2026-03-27 14:12",
    updatedAt: "2026-04-01 13:55",
    createdBy: "운영팀",
    updatedBy: "운영팀",
    hitCount: 34,
    lastMatchedAt: "2026-04-01 14:05"
  },
  {
    id: "cache-010",
    question: "결제 수단을 변경할 수 있나요?",
    answer: "결제 완료 전에는 수단 변경이 가능하며, 이미 결제된 주문은 취소 후 재주문해야 합니다.",
    status: "ACTIVE",
    createdAt: "2026-03-27 09:40",
    updatedAt: "2026-04-02 17:25",
    createdBy: "관리자",
    updatedBy: "관리자",
    hitCount: 69,
    lastMatchedAt: "2026-04-03 08:45"
  },
  {
    id: "cache-011",
    question: "환불 계좌 정보는 어디서 확인하나요?",
    answer: "환불 신청 화면에서 등록된 환불 계좌를 확인할 수 있으며, 필요 시 변경 가능합니다.",
    status: "ACTIVE",
    createdAt: "2026-03-26 11:10",
    updatedAt: "2026-04-03 09:05",
    createdBy: "운영팀",
    updatedBy: "관리자",
    hitCount: 41,
    lastMatchedAt: "2026-04-03 09:12"
  },
  {
    id: "cache-012",
    question: "상품 교환은 어떻게 진행되나요?",
    answer: "교환 사유를 접수한 후 회수 및 재발송 절차로 진행되며, 상품 상태에 따라 승인 여부가 달라집니다.",
    status: "INACTIVE",
    createdAt: "2026-03-25 15:35",
    updatedAt: "2026-04-01 18:10",
    createdBy: "관리자",
    updatedBy: "관리자",
    hitCount: 27,
    lastMatchedAt: null
  }
];

const normalize = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/[^0-9a-z가-힣]/gi, "");

const levenshteinSimilarity = (left: string, right: string) => {
  const a = normalize(left);
  const b = normalize(right);

  if (!a && !b) return 1;
  if (!a || !b) return 0;
  if (a === b) return 1;

  const rows = Array.from({ length: a.length + 1 }, (_, row) =>
    Array.from({ length: b.length + 1 }, (_, col) => (row === 0 ? col : col === 0 ? row : 0))
  );

  for (let row = 1; row <= a.length; row += 1) {
    for (let col = 1; col <= b.length; col += 1) {
      const cost = a[row - 1] === b[col - 1] ? 0 : 1;
      rows[row][col] = Math.min(
        rows[row - 1][col] + 1,
        rows[row][col - 1] + 1,
        rows[row - 1][col - 1] + cost
      );
    }
  }

  const distance = rows[a.length][b.length];
  return 1 - distance / Math.max(a.length, b.length);
};

export const findCacheQaDuplicate = (
  items: CacheQaItem[],
  question: string,
  ignoreId?: string
): CacheQaMatch | null => {
  const threshold = 0.85;
  let best: CacheQaMatch | null = null;

  for (const item of items) {
    if (ignoreId && item.id === ignoreId) continue;

    const score = Math.max(
      levenshteinSimilarity(item.question, question),
      normalize(item.question).includes(normalize(question)) ? 0.92 : 0,
      normalize(question).includes(normalize(item.question)) ? 0.92 : 0
    );

    if (score >= threshold && (!best || score > best.score)) {
      best = { item, score };
    }
  }

  return best;
};

export const getCacheQaInitialData = async (): Promise<{ items: CacheQaItem[] }> => ({
  items: cacheQaSeed
});

export const createCacheQaEntry = async (
  form: CacheQaForm,
  creator = "관리자"
): Promise<CacheQaItem> => {
  const timestamp = nowStamp();

  return {
    id: `cache-${Date.now()}`,
    question: form.question.trim(),
    answer: form.answer.trim(),
    status: form.status,
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy: creator,
    updatedBy: creator,
    hitCount: 0,
    lastMatchedAt: null
  };
};

export const updateCacheQaEntry = async (
  item: CacheQaItem,
  form: CacheQaForm,
  updater = "관리자"
): Promise<CacheQaItem> => {
  const timestamp = nowStamp();

  return {
    ...item,
    question: form.question.trim(),
    answer: form.answer.trim(),
    status: form.status,
    updatedAt: timestamp,
    updatedBy: updater
  };
};

export const toggleCacheQaEntryStatus = async (
  item: CacheQaItem,
  status: CacheQaStatus,
  updater = "관리자"
): Promise<CacheQaItem> => {
  const timestamp = nowStamp();

  return {
    ...item,
    status,
    updatedAt: timestamp,
    updatedBy: updater
  };
};
