"use client";

import { useMemo, useState } from "react";
import { DetailFrame } from "@/components/layout/detail-frame";
import { SectionHeader } from "@/components/layout/section-header";
import type { FeedbackDetail, FeedbackFilters, FeedbackReaction } from "@/types/feedback";
import { FEEDBACK_FILTER_OPTIONS, FEEDBACK_REACTION_LABELS } from "@/constants/feedback";
import { isWithinDateRange, type DateRange } from "@/utils/date-range";
import { compareStringDesc } from "@/utils/text";

type FeedbackPanelProps = {
  feedbacks: FeedbackDetail[];
};

const compareFeedbackDesc = (left: FeedbackDetail, right: FeedbackDetail) =>
  compareStringDesc(left.createdAt, right.createdAt);

export function FeedbackPanel({ feedbacks }: FeedbackPanelProps) {
  const [filters, setFilters] = useState<FeedbackFilters>({ reaction: "ALL" });
  const [dateDraft, setDateDraft] = useState<DateRange>({ startDate: "", endDate: "" });
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: "", endDate: "" });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return feedbacks
      .filter((feedback) => filters.reaction === "ALL" || feedback.reaction === filters.reaction)
      .filter((feedback) => isWithinDateRange(feedback.createdAt, dateRange))
      .slice()
      .sort(compareFeedbackDesc);
  }, [dateRange, feedbacks, filters.reaction]);

  const selected = filtered.find((feedback) => feedback.id === selectedId) ?? filtered[0] ?? null;

  const applyDateRange = () => {
    setDateRange(dateDraft);
  };

  const resetDateRange = () => {
    const emptyRange = { startDate: "", endDate: "" };
    setDateDraft(emptyRange);
    setDateRange(emptyRange);
  };

  return (
    <div className="feedback-layout">
      <div className="feedback-grid">
        <section className="feedback-list-card">
          <SectionHeader title="피드백 목록" className="feedback-list-header" />
          <div className="feedback-filter-bar">
            <div className="feedback-filter-field">
              <label className="field__label" htmlFor="feedback-reaction-filter">
                유형
              </label>
              <select
                id="feedback-reaction-filter"
                className="field__input feedback-filter-select"
                value={filters.reaction}
                onChange={(event) =>
                  setFilters({ reaction: event.target.value as FeedbackFilters["reaction"] })
                }
              >
                {FEEDBACK_FILTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="feedback-range-actions">
              <div className="feedback-range-field">
                <label className="field__label" htmlFor="feedback-range-start">
                  시작일
                </label>
                <input
                  id="feedback-range-start"
                  type="date"
                  className="field__input feedback-range-input"
                  value={dateDraft.startDate}
                  onChange={(event) =>
                    setDateDraft((current) => ({ ...current, startDate: event.target.value }))
                  }
                />
              </div>

              <span className="feedback-range-divider" aria-hidden="true">
                ~
              </span>

              <div className="feedback-range-field">
                <label className="field__label" htmlFor="feedback-range-end">
                  종료일
                </label>
                <input
                  id="feedback-range-end"
                  type="date"
                  className="field__input feedback-range-input"
                  value={dateDraft.endDate}
                  onChange={(event) =>
                    setDateDraft((current) => ({ ...current, endDate: event.target.value }))
                  }
                />
              </div>

              <div className="feedback-range-buttons">
                <button type="button" className="primary-button feedback-range-button" onClick={applyDateRange}>
                  검색
                </button>
                <button type="button" className="secondary-button feedback-range-button" onClick={resetDateRange}>
                  초기화
                </button>
              </div>
            </div>
          </div>

          <div className="feedback-list-scroll">
            <table className="content-table">
              <thead>
                <tr>
                  <th>작성일시</th>
                  <th>단지명</th>
                  <th>사용자</th>
                  <th>반응</th>
                  <th>부정사유</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="content-empty">
                      조건에 맞는 피드백이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr
                      key={item.id}
                      className={item.id === selected?.id ? "is-selected" : ""}
                      onClick={() => setSelectedId(item.id)}
                    >
                      <td>{item.createdAt}</td>
                      <td>{item.complexName}</td>
                      <td>{item.userId}</td>
                      <td>
                        <span
                          className={`feedback-reaction-badge feedback-reaction-badge--${item.reaction.toLowerCase()}`}
                        >
                          {FEEDBACK_REACTION_LABELS[item.reaction]}
                        </span>
                      </td>
                      <td>{item.hasNegativeReason ? "있음" : "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <DetailFrame
          className="feedback-detail-card"
          title="피드백 상세"
            actions={
              selected ? (
                <span className={`feedback-reaction-badge feedback-reaction-badge--${selected.reaction.toLowerCase()}`}>
                  {FEEDBACK_REACTION_LABELS[selected.reaction]}
                </span>
              ) : null
            }
        >
          {selected === null ? (
            <div className="content-empty content-empty--detail">
              피드백을 선택하면 상세 정보가 표시됩니다.
            </div>
          ) : (
            <div className="feedback-detail-scroll">
              <SectionHeader
                title={
                  <div className="feedback-detail-identity">
                    <span className="feedback-detail-identity__complex">{selected.complexName}</span>
                    <span className="feedback-detail-identity__user">{selected.userId}</span>
                  </div>
                }
                className="detail-frame__header feedback-detail-identity-header"
                titleAs="h3"
              />

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

              {selected.reaction === "NEGATIVE" && selected.negativeReason && (
                <div className="feedback-negative-reason">
                  <strong>부정사유</strong>
                  <p>{selected.negativeReason}</p>
                </div>
              )}
            </div>
          )}
        </DetailFrame>
      </div>
    </div>
  );
}
