"use client";

import { useEffect, useMemo, useState } from "react";
import { DetailFrame } from "@/components/layout/detail-frame";
import { ListPanel } from "@/components/layout/list-panel";
import { SectionHeader } from "@/components/layout/section-header";
import { Pagination } from "@/components/ui/pagination";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { ToastStack } from "@/components/ui/toast-stack";
import { useAutoDismissMessage } from "@/hooks/use-auto-dismiss-message";
import {
  createCacheQaEntry,
  findCacheQaDuplicate,
  toggleCacheQaEntryStatus,
  updateCacheQaEntry
} from "@/api/cache-qa";
import {
  CACHE_QA_ANSWER_MAX_LENGTH,
  CACHE_QA_PAGE_SIZE,
  CACHE_QA_QUESTION_MAX_LENGTH,
  CACHE_QA_STATUS_LABELS,
  CACHE_QA_STATUS_OPTIONS,
  CACHE_QA_TOAST_DISMISS_MS,
  DEFAULT_CACHE_QA_FORM
} from "@/constants/cache-qa";
import type { CacheQaFilters, CacheQaForm, CacheQaItem, CacheQaStatus } from "@/types/cache-qa";
import { compareStringDesc, normalizeSearchText } from "@/utils/text";

type CacheQaPanelProps = {
  items: CacheQaItem[];
};

type EditorMode = "CREATE" | "EDIT";

const compareDateDesc = (left: CacheQaItem, right: CacheQaItem) =>
  compareStringDesc(left.createdAt, right.createdAt);

export function CacheQaPanel({ items: initialItems }: CacheQaPanelProps) {
  const [items, setItems] = useState(initialItems.slice().sort(compareDateDesc));
  const [filters, setFilters] = useState<CacheQaFilters>({ keyword: "", status: "ALL" });
  const [searchDraft, setSearchDraft] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(initialItems[0]?.id ?? null);
  const [page, setPage] = useState(1);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode>("CREATE");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CacheQaForm>(DEFAULT_CACHE_QA_FORM);
  const messageState = useAutoDismissMessage(CACHE_QA_TOAST_DISMISS_MS);
  const errorState = useAutoDismissMessage(CACHE_QA_TOAST_DISMISS_MS);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const filteredItems = useMemo(() => {
    const keyword = normalizeSearchText(filters.keyword);

    return items
      .map((item) => {
        const normalizedQuestion = normalizeSearchText(item.question);
        const exactMatch =
          keyword.length === 0 ||
          normalizedQuestion.includes(keyword) ||
          keyword.includes(normalizedQuestion);

        const similarity =
          keyword.length === 0
            ? 1
            : Math.max(
                normalizedQuestion === keyword
                  ? 1
                  : 1 -
                      Math.abs(normalizedQuestion.length - keyword.length) /
                        Math.max(normalizedQuestion.length, keyword.length, 1),
                normalizedQuestion.includes(keyword) ? 0.92 : 0,
                keyword.includes(normalizedQuestion) ? 0.92 : 0
              );

        return { item, score: similarity, exactMatch };
      })
      .filter(({ item, score, exactMatch }) => {
        const statusMatch = filters.status === "ALL" || item.status === filters.status;
        const keywordMatch = keyword.length === 0 ? true : exactMatch || score >= 0.35;
        return statusMatch && keywordMatch;
      })
      .sort((left, right) => {
        if (keyword.length > 0 && right.score !== left.score) return right.score - left.score;
        return compareDateDesc(left.item, right.item);
      })
      .map(({ item }) => item);
  }, [filters.keyword, filters.status, items]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / CACHE_QA_PAGE_SIZE));
  const pagedItems = filteredItems.slice(
    (page - 1) * CACHE_QA_PAGE_SIZE,
    page * CACHE_QA_PAGE_SIZE
  );
  const selectedItem = filteredItems.find((item) => item.id === selectedId) ?? null;

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  useEffect(() => {
    if (filteredItems.length === 0) {
      setSelectedId(null);
      return;
    }

    if (!selectedId || !filteredItems.some((item) => item.id === selectedId)) {
      setSelectedId(filteredItems[0].id);
    }
  }, [filteredItems, selectedId]);

  const openCreateEditor = () => {
    setEditorMode("CREATE");
    setEditingId(null);
    setForm(DEFAULT_CACHE_QA_FORM);
    errorState.clearMessage();
    setEditorOpen(true);
  };

  const openEditEditor = () => {
    if (!selectedItem) return;

    setEditorMode("EDIT");
    setEditingId(selectedItem.id);
    setForm({
      question: selectedItem.question,
      answer: selectedItem.answer,
      status: selectedItem.status
    });
    errorState.clearMessage();
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    errorState.clearMessage();
  };

  const resetSearch = () => {
    setSearchDraft("");
    setFilters((current) => ({ ...current, keyword: "" }));
    setPage(1);
  };

  const applySearch = () => {
    setFilters((current) => ({ ...current, keyword: searchDraft.trim() }));
    setPage(1);
  };

  const handleSubmit = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      errorState.showMessage("질문과 답변을 모두 입력해 주세요.");
      return;
    }

    const duplicate = findCacheQaDuplicate(items, form.question.trim(), editingId ?? undefined);
    if (duplicate) {
      errorState.showMessage("유사한 질문이 이미 등록되어 있습니다.");
      return;
    }

    if (editorMode === "CREATE") {
      const nextItem = await createCacheQaEntry(form);
      setItems((current) => [nextItem, ...current].sort(compareDateDesc));
      setSelectedId(nextItem.id);
      messageState.showMessage("답변이 등록되었습니다.");
      setForm(DEFAULT_CACHE_QA_FORM);
      closeEditor();
      return;
    }

    if (!editingId) {
      errorState.showMessage("수정할 항목을 선택해 주세요.");
      return;
    }

    const currentItem = items.find((item) => item.id === editingId);
    if (!currentItem) {
      errorState.showMessage("수정 대상이 존재하지 않습니다.");
      return;
    }

    const updated = await updateCacheQaEntry(currentItem, form);
    setItems((current) =>
      current.map((item) => (item.id === editingId ? updated : item)).sort(compareDateDesc)
    );
    setSelectedId(updated.id);
    messageState.showMessage("답변이 수정되었습니다.");
    setForm(DEFAULT_CACHE_QA_FORM);
    setEditorMode("CREATE");
    setEditingId(null);
    closeEditor();
  };

  const handleToggleStatus = async () => {
    if (!selectedItem) return;

    const nextStatus: CacheQaStatus = selectedItem.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const updated = await toggleCacheQaEntryStatus(selectedItem, nextStatus);
    setItems((current) =>
      current.map((item) => (item.id === updated.id ? updated : item)).sort(compareDateDesc)
    );
    setSelectedId(updated.id);
    messageState.showMessage(
      nextStatus === "ACTIVE" ? "답변이 활성화되었습니다." : "답변이 비활성화되었습니다."
    );
  };

  const handleDelete = () => {
    if (!selectedItem) return;

    setItems((current) => {
      const next = current.filter((item) => item.id !== selectedItem.id).sort(compareDateDesc);
      setSelectedId(next[0]?.id ?? null);
      return next;
    });
    setDeleteOpen(false);
    messageState.showMessage("답변이 삭제되었습니다.");
    setEditorMode("CREATE");
    setEditingId(null);
    setForm(DEFAULT_CACHE_QA_FORM);
  };

  return (
    <div className="cache-qa-layout">
      <ToastStack
        items={[
          messageState.message
            ? { key: "cache-qa-success", tone: "success" as const, message: messageState.message }
            : null,
          errorState.message
            ? { key: "cache-qa-error", tone: "error" as const, message: errorState.message }
            : null
        ].filter((item): item is NonNullable<typeof item> => Boolean(item))}
      />

      <div className="cache-qa-grid">
        <ListPanel
          className="cache-qa-list-card"
          title="답변 목록"
          actions={
            <button type="button" className="primary-button" onClick={openCreateEditor}>
              답변 등록
            </button>
          }
          toolbar={
            <form
              className="cache-qa-toolbar"
              onSubmit={(event) => {
                event.preventDefault();
                applySearch();
              }}
            >
              <label className="field cache-qa-field">
                <span className="field__label">질문 검색</span>
                <input
                  className="field__input"
                  type="search"
                  placeholder="2자 이상 입력 권장"
                  value={searchDraft}
                  onChange={(event) => setSearchDraft(event.target.value)}
                />
              </label>

              <label className="field cache-qa-field">
                <span className="field__label">상태</span>
                <select
                  className="field__input"
                  value={filters.status}
                  onChange={(event) => {
                    setFilters((current) => ({
                      ...current,
                      status: event.target.value as CacheQaFilters["status"]
                    }));
                    setPage(1);
                  }}
                >
                  {CACHE_QA_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="cache-qa-toolbar__actions">
                <button type="submit" className="primary-button">
                  검색
                </button>
                <button type="button" className="secondary-button" onClick={resetSearch}>
                  초기화
                </button>
              </div>
            </form>
          }
          footer={<Pagination page={page} totalPages={totalPages} onChange={setPage} />}
        >
          <div className="list-panel__scroll cache-qa-list-scroll">
            {pagedItems.length === 0 ? (
              <div className="list-panel__empty">조건에 맞는 답변이 없습니다.</div>
            ) : (
              <table className="content-table cache-qa-table">
                <thead>
                  <tr>
                    <th>질문</th>
                    <th>상태</th>
                    <th>등록일</th>
                    <th>수정일</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedItems.map((item) => (
                    <tr
                      key={item.id}
                      className={item.id === selectedItem?.id ? "is-selected" : ""}
                      onClick={() => setSelectedId(item.id)}
                    >
                      <td>
                        <div className="content-table__title">{item.question}</div>
                      </td>
                      <td>
                        <span className={`status-badge status-badge--${item.status.toLowerCase()}`}>
                          {CACHE_QA_STATUS_LABELS[item.status]}
                        </span>
                      </td>
                      <td>{item.createdAt}</td>
                      <td>{item.updatedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </ListPanel>

        <aside className="cache-qa-side">
          <DetailFrame
            className="cache-qa-detail-card"
            title="상세 정보"
            actions={
              selectedItem ? (
                <span className={`status-badge status-badge--${selectedItem.status.toLowerCase()}`}>
                  {CACHE_QA_STATUS_LABELS[selectedItem.status]}
                </span>
              ) : null
            }
          >
            {selectedItem ? (
              <div className="cache-qa-detail-scroll">
                <div className="feedback-conversation-section">
                  <p className="feedback-conversation-label">대화 내용</p>
                  <div className="cache-qa-conversation">
                    <div className="feedback-conversation__turn feedback-conversation__turn--user">
                      <p className="feedback-conversation__speaker">질문</p>
                      <p className="feedback-conversation__message">{selectedItem.question}</p>
                    </div>

                    <div className="feedback-conversation__turn feedback-conversation__turn--bot">
                      <p className="feedback-conversation__speaker">답변</p>
                      <p className="feedback-conversation__message">{selectedItem.answer}</p>
                    </div>
                  </div>
                </div>

                <dl className="content-detail__list cache-qa-meta">
                  <div>
                    <dt>등록자</dt>
                    <dd>{selectedItem.createdBy}</dd>
                  </div>
                  <div>
                    <dt>등록일</dt>
                    <dd>{selectedItem.createdAt}</dd>
                  </div>
                  <div>
                    <dt>수정자</dt>
                    <dd>{selectedItem.updatedBy}</dd>
                  </div>
                  <div>
                    <dt>수정일</dt>
                    <dd>{selectedItem.updatedAt}</dd>
                  </div>
                  <div>
                    <dt>캐시 조회 수</dt>
                    <dd>{selectedItem.hitCount.toLocaleString()}</dd>
                  </div>
                </dl>

                <div className="cache-qa-detail-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={openEditEditor}
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={handleToggleStatus}
                    disabled={!selectedItem}
                  >
                    {selectedItem.status === "ACTIVE" ? "비활성화" : "활성화"}
                  </button>
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => setDeleteOpen(true)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ) : (
              <div className="list-panel__empty cache-qa-empty">
                답변을 선택하면 상세 정보가 표시됩니다.
              </div>
            )}
          </DetailFrame>
        </aside>
      </div>

      {editorOpen ? (
        <ModalDialog
          title={editorMode === "EDIT" ? "답변 수정" : "답변 등록"}
          ariaLabel={editorMode === "EDIT" ? "답변 수정" : "답변 등록"}
          onClose={closeEditor}
          size="xl"
          footerClassName="modal__footer--split"
          footer={
            <>
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  closeEditor();
                  setForm(DEFAULT_CACHE_QA_FORM);
                  setEditorMode("CREATE");
                  setEditingId(null);
                }}
              >
                초기화
              </button>
              <button type="button" className="primary-button" onClick={handleSubmit}>
                {editorMode === "EDIT" ? "수정 저장" : "등록"}
              </button>
            </>
          }
        >
          <div className="cache-qa-form cache-qa-form--modal">
            <label className="field">
              <span className="field__label">질문 *</span>
              <textarea
                className="field__input knowledge-textarea cache-qa-textarea"
                rows={3}
                maxLength={CACHE_QA_QUESTION_MAX_LENGTH}
                value={form.question}
                placeholder="캐시 응답용 질문을 입력해 주세요."
                onChange={(event) => setForm((current) => ({ ...current, question: event.target.value }))}
              />
              <p className="cache-qa-form__counter">
                {form.question.length}/{CACHE_QA_QUESTION_MAX_LENGTH}자
              </p>
            </label>

            <label className="field">
              <span className="field__label">답변 *</span>
              <textarea
                className="field__input knowledge-textarea cache-qa-textarea"
                rows={6}
                maxLength={CACHE_QA_ANSWER_MAX_LENGTH}
                value={form.answer}
                placeholder="캐시 응답으로 반환할 답변을 입력해 주세요."
                onChange={(event) => setForm((current) => ({ ...current, answer: event.target.value }))}
              />
              <p className="cache-qa-form__counter">
                {form.answer.length}/{CACHE_QA_ANSWER_MAX_LENGTH}자
              </p>
            </label>

            <label className="field">
              <span className="field__label">상태</span>
              <select
                className="field__input"
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    status: event.target.value as CacheQaStatus
                  }))
                }
              >
                <option value="ACTIVE">활성</option>
                <option value="INACTIVE">비활성</option>
              </select>
            </label>

            {errorState.message ? <p className="content-error">{errorState.message}</p> : null}
          </div>
        </ModalDialog>
      ) : null}

      {deleteOpen ? (
        <ModalDialog
          title="답변 삭제 확인"
          ariaLabel="답변 삭제 확인"
          onClose={() => setDeleteOpen(false)}
          size="sm"
          compact
          footerClassName="modal__footer--split"
          footer={
            <>
              <button type="button" className="secondary-button" onClick={() => setDeleteOpen(false)}>
                취소
              </button>
              <button type="button" className="danger-button" onClick={handleDelete}>
                삭제
              </button>
            </>
          }
        >
          <p className="content-confirm">선택한 답변을 삭제하면 캐시 응답에서 즉시 제외됩니다.</p>
        </ModalDialog>
      ) : null}
    </div>
  );
}
