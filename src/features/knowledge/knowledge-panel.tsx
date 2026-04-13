"use client";

import { useMemo, useState } from "react";
import type {
  KnowledgeDocument,
  KnowledgeQueryForm,
  KnowledgeResult,
} from "@/types/knowledge";
import { executeKnowledgeQuery } from "@/api/knowledge";
import { DetailFrame } from "@/components/layout/detail-frame";
import { SectionHeader } from "@/components/layout/section-header";

type KnowledgePanelProps = {
  documents: KnowledgeDocument[];
};

type QueryState = "IDLE" | "LOADING" | "SUCCESS" | "EMPTY" | "ERROR";

export function KnowledgePanel({ documents }: KnowledgePanelProps) {
  const [form, setForm] = useState<KnowledgeQueryForm>({
    question: "",
    documentType: "",
    documentId: "",
  });
  const [queryState, setQueryState] = useState<QueryState>("IDLE");
  const [result, setResult] = useState<KnowledgeResult | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredDocuments = useMemo(() => {
    if (!form.documentType) return documents;
    return documents.filter((doc) => doc.type === form.documentType);
  }, [form.documentType, documents]);

  const canQuery =
    form.question.length >= 1 &&
    form.documentType !== "" &&
    form.documentId !== "";

  const canReset = queryState !== "IDLE";

  const handleDocumentTypeChange = (value: string) => {
    setForm({
      ...form,
      documentType: value as KnowledgeQueryForm["documentType"],
      documentId: "",
    });
  };

  const handleQuery = async () => {
    setQueryState("LOADING");
    setResult(null);

    const res = await executeKnowledgeQuery(form);
    setQueryState(res ? "SUCCESS" : "EMPTY");
    if (res) setResult(res);
  };

  const handleReset = () => {
    setForm({ question: "", documentType: "", documentId: "" });
    setQueryState("IDLE");
    setResult(null);
    setCopied(false);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.answer).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="knowledge-layout">
      <div className="knowledge-grid">
        <section className="panel panel--main">
          <SectionHeader title="조회 조건" />

          <div className="knowledge-form">
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
              <span className="field__label">테스트 문서 *</span>
              <select
                className="field__input"
                value={form.documentId}
                disabled={!form.documentType}
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

        <DetailFrame className="panel panel--main" title="조회 결과">

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

              <div className="knowledge-footer">
                <button type="button" className="secondary-button" onClick={handleCopy}>
                  {copied ? "복사 완료" : "결과 복사"}
                </button>
              </div>
            </div>
          )}
        </DetailFrame>
      </div>
    </div>
  );
}
