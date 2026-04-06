"use client";

import { useMemo, useState } from "react";
import type { AccountDetail, AccountStatus, UserCandidate } from "@/types/accounts";
import { userCandidates as allCandidates } from "@/api/accounts";
import { DetailFrame } from "@/components/layout/detail-frame";
import { SectionHeader } from "@/components/layout/section-header";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { ToastStack } from "@/components/ui/toast-stack";
import { useAutoDismissMessage } from "@/hooks/use-auto-dismiss-message";
import {
  ACCOUNT_ACTION_TITLES,
  ACCOUNT_ROLE_LABELS,
  ACCOUNT_STATUS_LABELS,
  ACCOUNT_TOAST_DISMISS_MS,
  CURRENT_ACCOUNT_ID
} from "@/constants/accounts";

type AccountsPanelProps = {
  accounts: AccountDetail[];
};

type ActionModalType = "ACTIVATE" | "DEACTIVATE" | "UNLOCK";

type ActionModal = {
  type: ActionModalType;
  accountId: string;
  reason: string;
} | null;

export function AccountsPanel({ accounts: initialAccounts }: AccountsPanelProps) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionModal, setActionModal] = useState<ActionModal>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addReason, setAddReason] = useState("");
  const [addSearch, setAddSearch] = useState("");
  const [addSelectedCandidate, setAddSelectedCandidate] = useState<UserCandidate | null>(null);
  const successMessage = useAutoDismissMessage(ACCOUNT_TOAST_DISMISS_MS);

  const stats = useMemo(
    () => ({
      total: accounts.filter((account) => account.status === "ACTIVE").length,
      masters: accounts.filter((account) => account.role === "MASTER" && account.status === "ACTIVE").length,
      operators: accounts.filter((account) => account.role === "OPERATOR" && account.status === "ACTIVE").length,
      inactive: accounts.filter((account) => account.status !== "ACTIVE").length
    }),
    [accounts]
  );

  const selected = accounts.find((account) => account.id === selectedId) ?? null;

  const filteredCandidates = useMemo(() => {
    const keyword = addSearch.trim().toLowerCase();
    if (!keyword) return allCandidates;

    return allCandidates.filter(
      (candidate) =>
        candidate.name.toLowerCase().includes(keyword) ||
        candidate.id.toLowerCase().includes(keyword) ||
        candidate.complexCode.toLowerCase().includes(keyword)
    );
  }, [addSearch]);

  const applyStatus = (accountId: string, status: AccountStatus) => {
    setAccounts((prev) => prev.map((account) => (account.id === accountId ? { ...account, status } : account)));
    setSelectedId(accountId);
  };

  const handleActionConfirm = () => {
    if (!actionModal) return;

    const { type, accountId } = actionModal;
    if (type === "ACTIVATE") {
      applyStatus(accountId, "ACTIVE");
      successMessage.showMessage("관리자 권한이 복구되었습니다.");
    } else if (type === "DEACTIVATE") {
      applyStatus(accountId, "INACTIVE");
      successMessage.showMessage("관리자 권한이 비활성화되었습니다.");
    } else if (type === "UNLOCK") {
      applyStatus(accountId, "ACTIVE");
      successMessage.showMessage("계정 잠금이 해제되었습니다.");
    }

    setActionModal(null);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setAddReason("");
    setAddSearch("");
    setAddSelectedCandidate(null);
  };

  const handleAddConfirm = () => {
    if (!addSelectedCandidate) return;

    const newAccount: AccountDetail = {
      id: addSelectedCandidate.id,
      name: addSelectedCandidate.name,
      role: "OPERATOR",
      status: "ACTIVE",
      registeredAt: "2026-04-02",
      lastLoginAt: null,
      loginHistory: [],
      lockHistory: []
    };

    setAccounts((prev) => [...prev, newAccount]);
    closeAddModal();
    successMessage.showMessage("관리자가 추가되었습니다.");
  };

  const isSelf = (id: string) => id === CURRENT_ACCOUNT_ID;

  const statCards = [
    { label: "전체 활성", value: `${stats.total}명` },
    { label: "MASTER", value: `${stats.masters}명` },
    { label: "OPERATOR", value: `${stats.operators}명` },
    { label: "비활성·잠금", value: `${stats.inactive}명` }
  ];

  return (
    <div className="accounts-layout">
      <ToastStack
        items={
          successMessage.message
            ? [{ key: "accounts-success", tone: "success" as const, message: successMessage.message }]
            : []
        }
      />

      <div className="accounts-stat-grid">
        {statCards.map((card) => (
          <div key={card.label} className="metric-card">
            <p className="metric-card__label">{card.label}</p>
            <p className="metric-card__value">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="accounts-grid">
        <section className="accounts-list-card">
          <SectionHeader
            title="관리자 목록"
            actions={
              <button type="button" className="primary-button" onClick={() => setAddModalOpen(true)}>
                관리자 추가
              </button>
            }
            className="panel__header panel__header--compact"
          />

          <div className="accounts-list-scroll">
            <table className="content-table knowledge-history-table">
              <thead>
                <tr>
                  <th>이름</th>
                  <th>아이디</th>
                  <th>권한</th>
                  <th>상태</th>
                  <th>최종 로그인</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr
                    key={account.id}
                    className={account.id === selectedId ? "is-selected" : ""}
                    onClick={() => setSelectedId(account.id)}
                  >
                    <td>
                      <div className="content-table__title">{account.name}</div>
                      {isSelf(account.id) && <div className="content-table__sub">본인</div>}
                    </td>
                    <td>{account.id}</td>
                    <td>
                      <span
                        className={`status-badge ${account.role === "MASTER" ? "status-badge--active" : "status-badge--processing"}`}
                      >
                        {ACCOUNT_ROLE_LABELS[account.role]}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-badge--${account.status.toLowerCase()}`}>
                        {ACCOUNT_STATUS_LABELS[account.status]}
                      </span>
                    </td>
                    <td>{account.lastLoginAt ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <DetailFrame
          className="accounts-detail-card"
          title="관리자 상세"
          actions={
            selected ? (
              <span className={`status-badge status-badge--${selected.status.toLowerCase()}`}>
                {ACCOUNT_STATUS_LABELS[selected.status]}
              </span>
            ) : null
          }
        >
          {selected === null ? (
            <div className="content-empty content-empty--detail">관리자를 선택하면 상세 정보가 표시됩니다.</div>
          ) : (
            <div className="accounts-detail-scroll">
              <SectionHeader
                title={
                  <div className="accounts-detail-identity">
                    <span className="accounts-detail-identity__name">{selected.name}</span>
                    <div className="accounts-detail-identity__meta">
                      <span className="accounts-detail-identity__id">{selected.id}</span>
                      <span className="accounts-detail-identity__role">{ACCOUNT_ROLE_LABELS[selected.role]}</span>
                    </div>
                  </div>
                }
                className="detail-frame__header accounts-detail-identity-header"
                titleAs="h3"
              />

              <dl className="content-detail__list">
                <div>
                  <dt>등록일</dt>
                  <dd>{selected.registeredAt}</dd>
                </div>
                <div>
                  <dt>최종 로그인</dt>
                  <dd>{selected.lastLoginAt ?? "-"}</dd>
                </div>
              </dl>

              {!isSelf(selected.id) ? (
                <div className="accounts-action-row">
                  {selected.status === "INACTIVE" && (
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => setActionModal({ type: "ACTIVATE", accountId: selected.id, reason: "" })}
                    >
                      권한 복구
                    </button>
                  )}
                  {selected.status === "ACTIVE" && selected.role === "OPERATOR" && (
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => setActionModal({ type: "DEACTIVATE", accountId: selected.id, reason: "" })}
                    >
                      권한 비활성화
                    </button>
                  )}
                  {selected.status === "LOCKED" && (
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => setActionModal({ type: "UNLOCK", accountId: selected.id, reason: "" })}
                    >
                      잠금 해제
                    </button>
                  )}
                </div>
              ) : (
                <p className="accounts-self-notice">본인 계정은 권한 변경 및 비활성화가 제한됩니다.</p>
              )}

              <div className="accounts-history">
                <h4>로그인 이력</h4>
                {selected.loginHistory.length === 0 ? (
                  <p className="accounts-history-empty">로그인 이력이 없습니다.</p>
                ) : (
                  <ul className="accounts-history-list">
                    {selected.loginHistory.map((history) => (
                      <li key={history.id}>
                        <strong>{history.occurredAt}</strong>
                        {history.success ? (
                          <span className="accounts-login-success">성공</span>
                        ) : (
                          <span className="accounts-login-fail">실패</span>
                        )}
                        <span className="accounts-history-ip">{history.ip}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="accounts-history">
                <h4>잠금·해제 이력</h4>
                {selected.lockHistory.length === 0 ? (
                  <p className="accounts-history-empty">잠금·해제 이력이 없습니다.</p>
                ) : (
                  <ul className="accounts-history-list">
                    {selected.lockHistory.map((history) => (
                      <li key={history.id}>
                        <strong>{history.occurredAt}</strong>
                        <span
                          className={
                            history.type === "LOCKED"
                              ? "accounts-history-status--lock"
                              : "accounts-history-status--unlock"
                          }
                        >
                          {history.type === "LOCKED" ? "잠금" : "해제"}
                        </span>
                        <p className="accounts-history-sub">
                          {history.reason} · {history.actor}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </DetailFrame>
      </div>

      {actionModal && (
        <ModalDialog
          title={ACCOUNT_ACTION_TITLES[actionModal.type]}
          ariaLabel={ACCOUNT_ACTION_TITLES[actionModal.type]}
          onClose={() => setActionModal(null)}
          size="sm"
          footer={
            <>
              <button type="button" className="secondary-button" onClick={() => setActionModal(null)}>
                취소
              </button>
              <button
                type="button"
                className={actionModal.type === "DEACTIVATE" ? "danger-button" : "primary-button"}
                disabled={!actionModal.reason.trim()}
                onClick={handleActionConfirm}
              >
                확인
              </button>
            </>
          }
        >
          <label className="field">
            <span className="field__label">사유 입력 *</span>
            <textarea
              className="field__input knowledge-textarea"
              rows={3}
              value={actionModal.reason}
              placeholder="사유를 입력해 주세요."
              onChange={(event) => setActionModal({ ...actionModal, reason: event.target.value })}
            />
          </label>
        </ModalDialog>
      )}

      {addModalOpen && (
        <ModalDialog
          title="관리자 추가"
          ariaLabel="관리자 추가"
          onClose={closeAddModal}
          size="lg"
          footer={
            <>
              <button type="button" className="secondary-button" onClick={closeAddModal}>
                취소
              </button>
              <button
                type="button"
                className="primary-button"
                disabled={!addSelectedCandidate || !addReason.trim()}
                onClick={handleAddConfirm}
              >
                확인
              </button>
            </>
          }
        >
          <label className="field">
            <span className="field__label">사용자 검색 (이름, 아이디, 단지코드)</span>
            <input
              className="field__input"
              value={addSearch}
              placeholder="검색어 입력"
              onChange={(event) => setAddSearch(event.target.value)}
            />
          </label>

          <ul className="user-candidate-list">
            {filteredCandidates.length === 0 ? (
              <li className="user-candidate-empty">검색 결과가 없습니다.</li>
            ) : (
              filteredCandidates.map((candidate) => (
                <li key={candidate.id}>
                  <button
                    type="button"
                    className={`user-candidate-item${
                      addSelectedCandidate?.id === candidate.id ? " is-selected" : ""
                    }`}
                    onClick={() => setAddSelectedCandidate(candidate)}
                  >
                    <span>
                      {candidate.name} ({candidate.id})
                    </span>
                    <span className="user-candidate-code">{candidate.complexCode}</span>
                  </button>
                </li>
              ))
            )}
          </ul>

          <label className="field">
            <span className="field__label">추가 사유 * (최대 200자)</span>
            <textarea
              className="field__input knowledge-textarea"
              rows={2}
              maxLength={200}
              value={addReason}
              placeholder="추가 사유를 입력해 주세요."
              onChange={(event) => setAddReason(event.target.value)}
            />
          </label>
        </ModalDialog>
      )}
    </div>
  );
}
