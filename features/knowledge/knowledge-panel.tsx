"use client";

import { useMemo, useState } from "react";
import type {
  KnowledgeDataSource,
  KnowledgeDocument,
  KnowledgeQueryForm,
  KnowledgeResult,
  KnowledgeTestHistory,
  KnowledgeVerdict,
} from "@/types/knowledge";
import { executeKnowledgeQuery } from "@/api/knowledge";

type KnowledgePanelProps = {
  dataSources: KnowledgeDataSource[];
  documents: KnowledgeDocument[];
  testHistories: KnowledgeTestHistory[];
};

type QueryState = "IDLE" | "LOADING" | "SUCCESS" | "EMPTY" | "ERROR";

const verdictLabels: Record<KnowledgeVerdict, string> = {
  PASS: "적합",
  FAIL: "부적합",
};

const compareExecutedAtDesc = (left: KnowledgeTestHistory, right: KnowledgeTestHistory) =>
  right.executedAt.localeCompare(left.executedAt);

export function KnowledgePanel({
  dataSources,
  documents,
  testHistories: initialHistories,
}: KnowledgePanelProps) {
  const [form, setForm] = useState<KnowledgeQueryForm>({
    question: "",
    documentType: "",
    dataSourceId: "",
    documentId: "",
  });
  const [queryState, setQueryState] = useState<QueryState>("IDLE");
  const [result, setResult] = useState<KnowledgeResult | null>(null);
  const [verdict, setVerdict] = useState<KnowledgeVerdict | null>(null);
  const [memo, setMemo] = useState("");
  const [copied, setCopied] = useState(false);
  const [testHistories, setTestHistories] = useState(() =>
    initialHistories.slice().sort(compareExecutedAtDesc)
  );

  const filteredDataSources = useMemo(() => {
    if (!form.documentType) return [];
    return dataSources.filter((ds) => ds.type === form.documentType);
  }, [form.documentType, dataSources]);

  const filteredDocuments = useMemo(() => {
    if (!form.dataSourceId) return [];
    return documents.filter((doc) => doc.dataSourceId === form.dataSourceId);
  }, [form.dataSourceId, documents]);

  const canQuery =
    form.question.length >= 1 &&
    form.documentType !== "" &&
    form.dataSourceId !== "" &&
    form.documentId !== "";

  const canReset = queryState !== "IDLE";

  const handleDocumentTypeChange = (value: string) => {
    setForm({
      ...form,
      documentType: value as KnowledgeQueryForm["documentType"],
      dataSourceId: "",
      documentId: "",
    });
  };

  const handleDataSourceChange = (dataSourceId: string) => {
    setForm({ ...form, dataSourceId, documentId: "" });
  };

  const handleQuery = async () => {
    setQueryState("LOADING");
    setResult(null);
    setVerdict(null);
    setMemo("");

    const res = await executeKnowledgeQuery(form);
    setQueryState(res ? "SUCCESS" : "EMPTY");
    if (res) setResult(res);
  };

  const handleReset = () => {
    setForm({ question: "", documentType: "", dataSourceId: "", documentId: "" });
    setQueryState("IDLE");
    setResult(null);
    setVerdict(null);
    setMemo("");
    setCopied(false);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.answer).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSaveVerdict = () => {
    const doc = documents.find((d) => d.id === form.documentId);
    if (!doc) return;

    const entry: KnowledgeTestHistory = {
      id: `th-${Date.now()}`,
      question: form.question,
      documentName: doc.name,
      documentType: doc.type,
      executedAt: new Date().toLocaleString("sv-SE").slice(0, 16).replace("T", " "),
      verdict,
      memo: memo.trim() ? memo.trim() : null,
    };

    setTestHistories((prev) => [entry, ...prev].sort(compareExecutedAtDesc));
  };

  return (
    <div className="knowledge-layout">
      <div className="knowledge-grid">
        <section className="panel panel--main">
          <h2 className="panel__title">조회 조건</h2>
          <p className="panel__caption">테스트할 질문과 대상 문서를 선택합니다.</p>

          <div className="knowledge-form">
            <label className="field">
              <span className="field__label">질문 입력 *</span>
              <textarea
                className="field__input knowledge-textarea"
                value={form.question}
                maxLength={1000}
                rows={4}
                placeholder="1자 이상 입력 (최대 1000자)"
                onChange={(e) => setForm({ ...form, question: e.target.value })}
              />
            </label>

            <label className="field">
              <span className="field__label">문서 유형 *</span>
              <select
                className="field__input"
                value={form.documentType}
                onChange={(e) => handleDocumentTypeChange(e.target.value)}
              >
                <option value="">선택하세요</option>
                <option value="MANUAL">매뉴얼</option>
                <option value="FAQ">FAQ</option>
              </select>
            </label>

            <label className="field">
              <span className="field__label">데이터소스 *</span>
              <select
                className="field__input"
                value={form.dataSourceId}
                disabled={!form.documentType}
                onChange={(e) => handleDataSourceChange(e.target.value)}
              >
                <option value="">선택하세요</option>
                {filteredDataSources.map((ds) => (
                  <option key={ds.id} value={ds.id}>
                    {ds.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span className="field__label">테스트 문서 *</span>
              <select
                className="field__input"
                value={form.documentId}
                disabled={!form.dataSourceId}
                onChange={(e) => setForm({ ...form, documentId: e.target.value })}
              >
                <option value="">선택하세요</option>
                {filteredDocuments.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="knowledge-action-row">
              <button
                type="button"
                className="secondary-button"
                disabled={!canReset}
                onClick={handleReset}
              >
                초기화
              </button>
              <button
                type="button"
                className="primary-button"
                disabled={!canQuery || queryState === "LOADING"}
                onClick={handleQuery}
              >
                {queryState === "LOADING" ? "조회 중" : "조회"}
              </button>
            </div>
          </div>
        </section>

        <section className="panel panel--main">
          <h2 className="panel__title">조회 결과</h2>
          <p className="panel__caption">응답 결과를 확인하고 판정을 기록합니다.</p>

          {queryState === "IDLE" && (
            <div className="knowledge-result-empty">조건을 입력한 뒤 조회를 시작해 주세요.</div>
          )}
          {queryState === "LOADING" && <div className="knowledge-result-empty">조회 중입니다.</div>}
          {queryState === "EMPTY" && (
            <div className="knowledge-result-empty">선택한 문서에서 일치하는 답변을 찾지 못했습니다.</div>
          )}
          {queryState === "ERROR" && (
            <div className="knowledge-result-empty">조회에 실패했습니다. 다시 시도해 주세요.</div>
          )}

          {queryState === "SUCCESS" && result && (
            <div className="knowledge-result-scroll">
              <div className="knowledge-answer">
                <p className="knowledge-answer__text">{result.answer}</p>
                <p className="knowledge-answer__meta">생성 시각: {result.generatedAt}</p>
              </div>

              <dl className="content-detail__list knowledge-reference">
                <div>
                  <dt>참조 문서</dt>
                  <dd>
                    {result.referenceDocument.name}
                    <span className="knowledge-ref-type">
                      {result.referenceDocument.type === "MANUAL" ? "매뉴얼" : "FAQ"}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>저장 경로</dt>
                  <dd>{result.referenceDocument.path}</dd>
                </div>
                <div>
                  <dt>참조 단락</dt>
                  <dd>{result.referenceParagraph}</dd>
                </div>
              </dl>

              <p className="knowledge-verdict-label">결과 판정</p>
              <div className="knowledge-verdict">
                <button
                  type="button"
                  className={`knowledge-verdict__button${verdict === "PASS" ? " is-pass" : ""}`}
                  onClick={() => setVerdict(verdict === "PASS" ? null : "PASS")}
                >
                  적합
                </button>
                <button
                  type="button"
                  className={`knowledge-verdict__button${verdict === "FAIL" ? " is-fail" : ""}`}
                  onClick={() => setVerdict(verdict === "FAIL" ? null : "FAIL")}
                >
                  부적합
                </button>
              </div>

              <label className="field knowledge-memo-field">
                <span className="field__label">검증 메모 (선택)</span>
                <textarea
                  className="field__input knowledge-textarea"
                  value={memo}
                  rows={3}
                  placeholder="검증 메모를 입력해 주세요."
                  onChange={(e) => setMemo(e.target.value)}
                />
              </label>

              <div className="knowledge-footer">
                <button type="button" className="secondary-button" onClick={handleCopy}>
                  {copied ? "복사 완료" : "결과 복사"}
                </button>
                <button type="button" className="primary-button" onClick={handleSaveVerdict}>
                  판정 저장
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      <section className="panel panel--main">
        <h2 className="panel__title">테스트 실행 이력</h2>
        <p className="panel__caption">문서별 테스트 실행 이력을 확인합니다.</p>

        <div className="knowledge-history-scroll">
          <table className="content-table knowledge-history-table">
            <thead>
              <tr>
                <th>질문</th>
                <th>문서명</th>
                <th>유형</th>
                <th>실행시각</th>
                <th>판정</th>
                <th>메모</th>
              </tr>
            </thead>
            <tbody>
              {testHistories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="content-empty">
                    조회 이력이 없습니다.
                  </td>
                </tr>
              ) : (
                testHistories.map((item) => (
                  <tr key={item.id}>
                    <td>{item.question}</td>
                    <td>{item.documentName}</td>
                    <td>{item.documentType === "MANUAL" ? "매뉴얼" : "FAQ"}</td>
                    <td>{item.executedAt}</td>
                    <td>
                      {item.verdict === null ? (
                        <span className="status-badge status-badge--processing">미판정</span>
                      ) : (
                        <span
                          className={`status-badge ${item.verdict === "PASS" ? "status-badge--active" : "status-badge--failed"}`}
                        >
                          {verdictLabels[item.verdict]}
                        </span>
                      )}
                    </td>
                    <td>{item.memo ?? "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
