import type { FeedbackDetail } from "@/types/feedback";

const feedbackDetails: FeedbackDetail[] = [
  {
    id: "fb-001",
    complexName: "한강 아파트",
    userId: "user_2***",
    reaction: "POSITIVE",
    hasNegativeReason: false,
    createdAt: "2026-04-02 09:15",
    conversation: [
      {
        speaker: "USER",
        message: "수납 방법이 어떻게 되나요?",
        sentAt: "2026-04-02 09:14",
      },
      {
        speaker: "BOT",
        message:
          "수납은 관리비 고지서 기준으로 매월 25일까지 납부하시면 됩니다. 온라인 뱅킹 또는 자동이체를 통해 납부하실 수 있습니다.",
        sentAt: "2026-04-02 09:14",
      },
    ],
    negativeReason: null,
  },
  {
    id: "fb-002",
    complexName: "마포 자이",
    userId: "user_5***",
    reaction: "NEGATIVE",
    hasNegativeReason: true,
    createdAt: "2026-04-02 10:22",
    conversation: [
      {
        speaker: "USER",
        message: "차량 등록 서류가 뭔가요?",
        sentAt: "2026-04-02 10:21",
      },
      {
        speaker: "BOT",
        message:
          "차량 등록을 위해서는 주민등록등본, 차량등록증, 인감증명서가 필요합니다.",
        sentAt: "2026-04-02 10:21",
      },
    ],
    negativeReason: "응답이 너무 간략합니다. 구체적인 절차 안내가 필요합니다.",
  },
  {
    id: "fb-003",
    complexName: "강남 래미안",
    userId: "user_9***",
    reaction: "POSITIVE",
    hasNegativeReason: false,
    createdAt: "2026-04-01 16:40",
    conversation: [
      {
        speaker: "USER",
        message: "연말정산 관련 서류 제출 기한이 언제인가요?",
        sentAt: "2026-04-01 16:39",
      },
      {
        speaker: "BOT",
        message:
          "연말정산 서류 제출 기한은 매년 1월 15일까지입니다. 회사 내부 정책에 따라 조기 마감될 수 있으니 인사팀에 확인하세요.",
        sentAt: "2026-04-01 16:39",
      },
    ],
    negativeReason: null,
  },
  {
    id: "fb-004",
    complexName: "서초 e편한세상",
    userId: "user_3***",
    reaction: "NEGATIVE",
    hasNegativeReason: false,
    createdAt: "2026-04-01 11:05",
    conversation: [
      {
        speaker: "USER",
        message: "보안 서비스 신청 방법을 알려주세요",
        sentAt: "2026-04-01 11:04",
      },
      {
        speaker: "BOT",
        message: "죄송합니다. 해당 내용에 대한 정보를 찾지 못했습니다.",
        sentAt: "2026-04-01 11:04",
      },
    ],
    negativeReason: null,
  },
];

export async function getFeedbacks(): Promise<FeedbackDetail[]> {
  return feedbackDetails.slice().sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}
