"use client";

import { useMemo, useState } from "react";
import type { FeedbackDetail, FeedbackFilters, FeedbackReaction } from "@/types/feedback";

type FeedbackPanelProps = {
  feedbacks: FeedbackDetail[];
};

const reactionLabels: Record<FeedbackReaction, string> = {
  POSITIVE: "긍정",
  NEGATIVE: "부정"
};

const filterOptions: Array<{ label: string; value: FeedbackFilters["reaction"] }> = [
  { label: "전체", value: "ALL" },
  { label: "긍정", value: "POSITIVE" },
  { label: "부정", value: "NEGATIVE" }
];

const compareFeedbackDesc = (left: FeedbackDetail, right: FeedbackDetail) =>
  right.createdAt.localeCompare(left.createdAt);

export function FeedbackPanel({ feedbacks }: FeedbackPanelProps) {
  const [filters, setFilters] = useState<FeedbackFilters>({ reaction: "ALL" });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const next = feedbacks
      .filter((feedback) => filters.reaction === "ALL" || feedback.reaction === filters.reaction)
      .slice()
      .sort(compareFeedbackDesc);

    return next;
  }, [feedbacks, filters.reaction]);

  const selected = filtered.find((feedback) => feedback.id === selectedId) ?? filtered[0] ?? null;

  return (
    <div className="feedback-layout">
      <div className="feedback-stat-bar">
        <div className="metric-card feedback-stat-card">
          <p className="metric-card__label">전체 피드백</p>
          <p className="metric-card__value">{feedbacks.length}</p>
        </div>
      </div>

      <div className="feedback-grid">
        <section className="feedback-list-card">
          <div className="feedback-filters">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`feedback-filter__button${filters.reaction === opt.value ? " is-active" : ""}`}
                onClick={() => setFilters({ reaction: opt.value })}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="feedback-list-scroll">
            <table className="content-table">
              <thead>
                <tr>
                  <th>등록시점</th>
                  <th>대화명</th>
                  <th>사용자</th>
                  <th>반응</th>
                  <th>부정 사유</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="content-empty">
                      조건에 맞는 피드백이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filtered.map((fb) => (
                    <tr
                      key={fb.id}
                      className={fb.id === selected?.id ? "is-selected" : ""}
                      onClick={() => setSelectedId(fb.id)}
                    >
                      <td>{fb.createdAt}</td>
                      <td>{fb.complexName}</td>
                      <td>{fb.userId}</td>
                      <td>
                        <span
                          className={`feedback-reaction-badge feedback-reaction-badge--${fb.reaction.toLowerCase()}`}
                        >
                          {reactionLabels[fb.reaction]}
                        </span>
                      </td>
                      <td>{fb.hasNegativeReason ? "있음" : "-"}</td>
                      <td>
                        <button
                          type="button"
                          className="secondary-button table-btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(fb.id);
                          }}
                        >
                          상세
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="feedback-detail-card">
          {selected === null ? (
            <div className="content-empty content-empty--detail">
              피드백을 선택하면 상세 정보가 표시됩니다.
            </div>
          ) : (
            <div className="feedback-detail-scroll">
              <div className="content-detail__header">
                <div>
                  <h3 className="content-detail__title">{selected.complexName}</h3>
                  <p className="content-detail__caption">
                    {selected.userId} · {selected.createdAt}
                  </p>
                </div>
                <span
                  className={`feedback-reaction-badge feedback-reaction-badge--${selected.reaction.toLowerCase()}`}
                >
                  {reactionLabels[selected.reaction]}
                </span>
              </div>

              {selected.reaction === "NEGATIVE" && selected.negativeReason && (
                <div className="feedback-negative-reason">
                  <strong>부정 사유</strong>
                  <p>{selected.negativeReason}</p>
                </div>
              )}

              <div className="feedback-conversation-section">
                <p className="feedback-conversation-label">대화 내용</p>
                <div className="feedback-conversation">
                  {selected.conversation.map((turn, index) => (
                    <div
                      key={index}
                      className={`feedback-conversation__turn feedback-conversation__turn--${turn.speaker.toLowerCase()}`}
                    >
                      <p className="feedback-conversation__speaker">
                        {turn.speaker === "USER" ? "사용자" : "챗봇"} · {turn.sentAt}
                      </p>
                      <p className="feedback-conversation__message">{turn.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
