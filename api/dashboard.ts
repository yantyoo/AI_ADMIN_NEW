import type { DashboardPayload, FeedbackReactionSummary, TimeRange } from "@/types/dashboard";

const buildSummary = (
  totalCount: number,
  count: number,
  keywords: Array<{ label: string; count: number }>
): FeedbackReactionSummary => {
  const ratio = Number(((count / Math.max(totalCount, 1)) * 100).toFixed(1));

  return {
    count,
    ratio,
    keywords: keywords.map((keyword, index) => ({
      rank: index + 1,
      label: keyword.label,
      count: keyword.count,
      ratio: Number(((keyword.count / Math.max(count, 1)) * 100).toFixed(1))
    }))
  };
};

export const dashboardMockByRange: Record<TimeRange, DashboardPayload> = {
  DAY: {
    selectedRange: "DAY",
    metrics: [
      {
        key: "visitors",
        label: "접속자 수",
        value: 184,
        policyText: "중복 사용자를 제외한 단일 사용자 기준입니다.",
        compareLabel: "전일 대비",
        compareRate: 4.8,
        compareDirection: "UP"
      },
      {
        key: "inquiries",
        label: "문의 수",
        value: 326,
        policyText: "사용자 질문 발생 건수를 기준으로 집계합니다.",
        compareLabel: "전일 대비",
        compareRate: 2.1,
        compareDirection: "UP"
      },
      {
        key: "failures",
        label: "실패 수",
        value: 4,
        policyText: "실패 응답 발생 건수를 기준으로 집계합니다.",
        compareLabel: "전일 대비",
        compareRate: 1.2,
        compareDirection: "DOWN"
      }
    ],
    trend: [
      { label: "00", dateLabel: "2026-04-02 00:00", visitors: 12, inquiries: 8 },
      { label: "04", dateLabel: "2026-04-02 04:00", visitors: 18, inquiries: 12 },
      { label: "08", dateLabel: "2026-04-02 08:00", visitors: 56, inquiries: 40 },
      { label: "12", dateLabel: "2026-04-02 12:00", visitors: 73, inquiries: 55 },
      { label: "16", dateLabel: "2026-04-02 16:00", visitors: 92, inquiries: 69 },
      { label: "20", dateLabel: "2026-04-02 20:00", visitors: 75, inquiries: 60 },
      { label: "24", dateLabel: "2026-04-03 00:00", visitors: 41, inquiries: 28 }
    ],
    fixedKeywords: [
      { rank: 1, label: "비밀번호 변경", count: 92, ratio: 42.2 },
      { rank: 2, label: "접속 지연", count: 61, ratio: 28 },
      { rank: 3, label: "자동 등록", count: 44, ratio: 20.2 }
    ],
    fixedFeedbackRatio: {
      totalCount: 340,
      defaultReaction: "POSITIVE",
      positive: buildSummary(340, 187, [
        { label: "응답이 빨라요", count: 52 },
        { label: "설명이 명확해요", count: 44 },
        { label: "추천할 만해요", count: 33 },
        { label: "사용하기 쉬워요", count: 29 },
        { label: "불편함이 없어요", count: 24 }
      ]),
      negative: buildSummary(340, 153, [
        { label: "응답이 늦어요", count: 41 },
        { label: "의도가 조금 달라요", count: 36 },
        { label: "설명이 부족해요", count: 28 },
        { label: "오류가 발생했어요", count: 25 },
        { label: "결과가 기대와 달라요", count: 23 }
      ])
    }
  },
  WEEK: {
    selectedRange: "WEEK",
    metrics: [
      {
        key: "visitors",
        label: "접속자 수",
        value: 1051,
        policyText: "중복 사용자를 제외한 단일 사용자 기준입니다.",
        compareLabel: "지난주 대비",
        compareRate: 5,
        compareDirection: "UP"
      },
      {
        key: "inquiries",
        label: "문의 수",
        value: 1820,
        policyText: "사용자 질문 발생 건수를 기준으로 집계합니다.",
        compareLabel: "지난주 대비",
        compareRate: 3.4,
        compareDirection: "UP"
      },
      {
        key: "failures",
        label: "실패 수",
        value: 19,
        policyText: "실패 응답 발생 건수를 기준으로 집계합니다.",
        compareLabel: "지난주 대비",
        compareRate: 0.8,
        compareDirection: "DOWN"
      }
    ],
    trend: [
      { label: "03.24", dateLabel: "2026-03-24", visitors: 330, inquiries: 250 },
      { label: "03.25", dateLabel: "2026-03-25", visitors: 430, inquiries: 320 },
      { label: "03.26", dateLabel: "2026-03-26", visitors: 500, inquiries: 360 },
      { label: "03.27", dateLabel: "2026-03-27", visitors: 495, inquiries: 350 },
      { label: "03.28", dateLabel: "2026-03-28", visitors: 540, inquiries: 410 },
      { label: "03.29", dateLabel: "2026-03-29", visitors: 642, inquiries: 506 },
      { label: "03.30", dateLabel: "2026-03-30", visitors: 492, inquiries: 370 }
    ],
    fixedKeywords: [
      { rank: 1, label: "비밀번호 변경", count: 1520, ratio: 44.8 },
      { rank: 2, label: "접속 지연", count: 985, ratio: 29.1 },
      { rank: 3, label: "자동 등록", count: 503, ratio: 14.8 }
    ],
    fixedFeedbackRatio: {
      totalCount: 1680,
      defaultReaction: "POSITIVE",
      positive: buildSummary(1680, 924, [
        { label: "응답이 빨라요", count: 260 },
        { label: "설명이 명확해요", count: 210 },
        { label: "추천할 만해요", count: 175 },
        { label: "사용하기 쉬워요", count: 150 },
        { label: "불편함이 없어요", count: 129 }
      ]),
      negative: buildSummary(1680, 756, [
        { label: "응답이 늦어요", count: 230 },
        { label: "의도가 조금 달라요", count: 162 },
        { label: "설명이 부족해요", count: 143 },
        { label: "오류가 발생했어요", count: 121 },
        { label: "결과가 기대와 달라요", count: 100 }
      ])
    }
  },
  MONTH: {
    selectedRange: "MONTH",
    metrics: [
      {
        key: "visitors",
        label: "접속자 수",
        value: 4216,
        policyText: "중복 사용자를 제외한 단일 사용자 기준입니다.",
        compareLabel: "전월 대비",
        compareRate: 7.2,
        compareDirection: "UP"
      },
      {
        key: "inquiries",
        label: "문의 수",
        value: 8014,
        policyText: "사용자 질문 발생 건수를 기준으로 집계합니다.",
        compareLabel: "전월 대비",
        compareRate: 4.6,
        compareDirection: "UP"
      },
      {
        key: "failures",
        label: "실패 수",
        value: 83,
        policyText: "실패 응답 발생 건수를 기준으로 집계합니다.",
        compareLabel: "전월 대비",
        compareRate: 2.4,
        compareDirection: "DOWN"
      }
    ],
    trend: [
      { label: "1주", dateLabel: "2026-03-01 ~ 2026-03-07", visitors: 1420, inquiries: 1110 },
      { label: "2주", dateLabel: "2026-03-08 ~ 2026-03-14", visitors: 1880, inquiries: 1425 },
      { label: "3주", dateLabel: "2026-03-15 ~ 2026-03-21", visitors: 2140, inquiries: 1632 },
      { label: "4주", dateLabel: "2026-03-22 ~ 2026-03-31", visitors: 2574, inquiries: 1847 }
    ],
    fixedKeywords: [
      { rank: 1, label: "비밀번호 변경", count: 3610, ratio: 48.1 },
      { rank: 2, label: "접속 지연", count: 1922, ratio: 25.6 },
      { rank: 3, label: "자동 등록", count: 1316, ratio: 17.5 }
    ],
    fixedFeedbackRatio: {
      totalCount: 11240,
      defaultReaction: "POSITIVE",
      positive: buildSummary(11240, 6519, [
        { label: "응답이 빨라요", count: 1820 },
        { label: "설명이 명확해요", count: 1512 },
        { label: "추천할 만해요", count: 1260 },
        { label: "사용하기 쉬워요", count: 1014 },
        { label: "불편함이 없어요", count: 913 }
      ]),
      negative: buildSummary(11240, 4721, [
        { label: "응답이 늦어요", count: 1290 },
        { label: "의도가 조금 달라요", count: 1174 },
        { label: "설명이 부족해요", count: 980 },
        { label: "오류가 발생했어요", count: 745 },
        { label: "결과가 기대와 달라요", count: 532 }
      ])
    }
  }
};

export async function getDashboardData(range: TimeRange = "WEEK"): Promise<DashboardPayload> {
  return dashboardMockByRange[range];
}
