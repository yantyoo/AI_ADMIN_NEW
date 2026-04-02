"use client";

import { useMemo, useRef, useState } from "react";
import { uploadContentDocument } from "@/api/content";
import type {
  ContentDocument,
  ContentDocumentType,
  ContentFilters,
  ContentUploadForm
} from "@/types/content";

type ContentPanelProps = {
  documents: ContentDocument[];
};

type UploadMode = "CREATE" | "EDIT";

const typeOptions: Array<{ label: string; value: ContentDocumentType | "ALL" }> = [
  { label: "전체", value: "ALL" },
  { label: "매뉴얼", value: "MANUAL" },
  { label: "FAQ", value: "FAQ" }
];

const statusLabels: Record<ContentDocument["status"], string> = {
  ACTIVE: "정상",
  FAILED: "실패"
};

const nowStamp = () => new Date().toLocaleString("sv-SE").slice(0, 16).replace("T", " ");

export function ContentPanel({ documents }: ContentPanelProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [filters, setFilters] = useState<ContentFilters>({ keyword: "", type: "ALL" });
  const [searchDraft, setSearchDraft] = useState("");
  const [localDocuments, setLocalDocuments] = useState(documents);
  const [selectedDocumentId, setSelectedDocumentId] = useState(documents[0]?.id ?? "");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<UploadMode>("CREATE");
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [uploadForm, setUploadForm] = useState<ContentUploadForm>({
    fileName: "",
    path: "",
    type: "MANUAL"
  });

  const filteredDocuments = useMemo(() => {
    return localDocuments.filter((document) => {
      const keyword = filters.keyword.trim().toLowerCase();
      const keywordMatch =
        keyword.length === 0 ||
        document.name.toLowerCase().includes(keyword) ||
        document.path.toLowerCase().includes(keyword);
      const typeMatch = filters.type === "ALL" || document.type === filters.type;

      return keywordMatch && typeMatch;
    });
  }, [filters.keyword, filters.type, localDocuments]);

  const selectedDocument =
    filteredDocuments.find((document) => document.id === selectedDocumentId) ??
    filteredDocuments[0] ??
    null;

  const canSubmitUpload =
    uploadForm.fileName.trim().length > 0 &&
    uploadForm.path.trim().length > 0 &&
    selectedFileName.trim().length > 0;

  const applySearch = () => {
    setFilters((current) => ({ ...current, keyword: searchDraft.trim() }));
  };

  const openCreateModal = () => {
    setUploadMode("CREATE");
    setEditingDocumentId(null);
    setUploadForm({ fileName: "", path: "", type: "MANUAL" });
    setSelectedFileName("");
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsUploadOpen(true);
  };

  const openEditModal = () => {
    if (!selectedDocument) return;

    setUploadMode("EDIT");
    setEditingDocumentId(selectedDocument.id);
    setUploadForm({
      fileName: selectedDocument.fileName,
      path: selectedDocument.path,
      type: selectedDocument.type
    });
    setSelectedFileName(selectedDocument.fileName);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsUploadOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadOpen(false);
    setEditingDocumentId(null);
    setSelectedFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadSubmit = async () => {
    if (!canSubmitUpload) {
      setErrorMessage("파일과 저장 경로를 입력해 주세요.");
      return;
    }

    const submitted = await uploadContentDocument(uploadForm);
    const timestamp = nowStamp();

    if (uploadMode === "CREATE" || !editingDocumentId) {
      setLocalDocuments((current) => [
        {
          ...submitted,
          status: "ACTIVE",
          createdAt: timestamp,
          updatedAt: timestamp
        },
        ...current
      ]);
      setSelectedDocumentId(submitted.id);
      setUploadMessage("문서 업로드가 완료되었습니다.");
    } else {
      setLocalDocuments((current) =>
        current.map((document) => {
          if (document.id !== editingDocumentId) {
            return document;
          }

          const nextVersion = `v${document.history.length + 1}`;

          return {
            ...document,
            name: submitted.name,
            fileName: submitted.fileName,
            path: submitted.path,
            type: submitted.type,
            status: "ACTIVE",
            updatedAt: timestamp,
            history: [
              {
                id: `hist-${Date.now()}`,
                version: nextVersion,
                actor: "관리자",
                action: "수정",
                reason: "기존 문서 수정 업로드",
                occurredAt: timestamp
              },
              ...document.history
            ]
          };
        })
      );
      setSelectedDocumentId(editingDocumentId);
      setUploadMessage("문서가 수정되었습니다.");
    }

    setErrorMessage(null);
    closeUploadModal();
    setUploadForm({ fileName: "", path: "", type: "MANUAL" });
  };

  const handleDelete = () => {
    if (!selectedDocument) return;

    setLocalDocuments((current) => {
      const nextDocuments = current.filter((document) => document.id !== selectedDocument.id);
      setSelectedDocumentId(nextDocuments[0]?.id ?? "");
      return nextDocuments;
    });
    setIsDeleteOpen(false);
    setUploadMessage("문서 삭제가 완료되었습니다.");
  };

  const handleDownload = () => {
    if (!selectedDocument) return;
    setUploadMessage("문서 다운로드를 준비했습니다.");
  };

  const handleFileChange = (file: File | undefined) => {
    if (!file) {
      setSelectedFileName("");
      setUploadForm((current) => ({ ...current, fileName: "" }));
      return;
    }

    setSelectedFileName(file.name);
    setUploadForm((current) => ({ ...current, fileName: file.name }));
  };

  return (
    <div className="content-layout">
      <section className="panel panel--main">
        <div className="panel__header panel__header--compact">
          <div>
            <h2 className="panel__title">문서 목록</h2>
            <p className="panel__caption">RAG 문서를 검색하고 필터링할 수 있습니다.</p>
          </div>
          <button type="button" className="primary-button" onClick={openCreateModal}>
            문서 업로드
          </button>
        </div>

        <form
          className="content-toolbar content-toolbar--content"
          onSubmit={(event) => {
            event.preventDefault();
            applySearch();
          }}
        >
          <label className="field">
            <span className="field__label">문서유형</span>
            <select
              className="field__input"
              value={filters.type}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  type: event.target.value as ContentDocumentType | "ALL"
                }))
              }
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field__label">문서명 검색</span>
            <input
              className="field__input"
              type="search"
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder="2자 이상 입력"
            />
          </label>

          <button type="submit" className="primary-button content-toolbar__button">
            검색
          </button>
        </form>

        <div className="content-grid">
          <section className="content-table-card">
            <div className="content-table-scroll">
              <table className="content-table">
                <thead>
                  <tr>
                    <th>문서명</th>
                    <th>유형</th>
                    <th>등록자</th>
                    <th>등록일시</th>
                    <th>최종 수정일</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="content-empty">
                        조건에 맞는 문서가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filteredDocuments.map((document) => (
                      <tr
                        key={document.id}
                        className={document.id === selectedDocument?.id ? "is-selected" : ""}
                        onClick={() => setSelectedDocumentId(document.id)}
                      >
                        <td>
                          <div className="content-table__title">{document.name}</div>
                          <div className="content-table__sub">{document.path}</div>
                        </td>
                        <td>{document.type === "MANUAL" ? "매뉴얼" : "FAQ"}</td>
                        <td>{document.author}</td>
                        <td>{document.createdAt}</td>
                        <td>{document.updatedAt}</td>
                        <td>
                          <span className={`status-badge status-badge--${document.status.toLowerCase()}`}>
                            {statusLabels[document.status]}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="content-detail-card">
            {selectedDocument ? (
              <div className="content-detail-scroll">
                <div className="content-detail__header">
                  <div>
                    <h3 className="content-detail__title">{selectedDocument.name}</h3>
                    <p className="content-detail__caption">
                      {selectedDocument.type === "MANUAL" ? "매뉴얼" : "FAQ"} · {selectedDocument.fileName}
                    </p>
                  </div>
                  <span className={`status-badge status-badge--${selectedDocument.status.toLowerCase()}`}>
                    {statusLabels[selectedDocument.status]}
                  </span>
                </div>

                <dl className="content-detail__list">
                  <div>
                    <dt>저장 경로</dt>
                    <dd>{selectedDocument.path}</dd>
                  </div>
                  <div>
                    <dt>등록자</dt>
                    <dd>{selectedDocument.author}</dd>
                  </div>
                  <div>
                    <dt>등록일시</dt>
                    <dd>{selectedDocument.createdAt}</dd>
                  </div>
                  <div>
                    <dt>최종 수정일</dt>
                    <dd>{selectedDocument.updatedAt}</dd>
                  </div>
                  <div>
                    <dt>파일 크기</dt>
                    <dd>{selectedDocument.fileSize}</dd>
                  </div>
                </dl>

                <div className="content-detail-actions">
                  <button type="button" className="secondary-button" onClick={handleDownload}>
                    다운로드
                  </button>
                  <button type="button" className="secondary-button" onClick={openEditModal}>
                    수정
                  </button>
                  <button type="button" className="danger-button" onClick={() => setIsDeleteOpen(true)}>
                    삭제
                  </button>
                </div>

                <section className="content-history">
                  <h4>변경 이력</h4>
                  <ul>
                    {selectedDocument.history.map((item) => (
                      <li key={item.id}>
                        <strong>{item.version}</strong>
                        <span>
                          {item.actor} · {item.action} · {item.occurredAt}
                        </span>
                        <p>{item.reason}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            ) : (
              <div className="content-empty content-empty--detail">선택된 문서가 없습니다.</div>
            )}
          </aside>
        </div>

        {uploadMessage ? <p className="content-message">{uploadMessage}</p> : null}
        {errorMessage ? <p className="content-error">{errorMessage}</p> : null}
      </section>

      {isUploadOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={closeUploadModal}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={uploadMode === "EDIT" ? "문서 수정 업로드" : "문서 업로드"}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal__header">
              <h3>{uploadMode === "EDIT" ? "문서 수정 업로드" : "문서 업로드"}</h3>
              <button type="button" className="icon-button" onClick={closeUploadModal}>
                ×
              </button>
            </div>

            <div className="modal__body">
              <label className="field">
                <span className="field__label">파일 선택 *</span>
                <input
                  ref={fileInputRef}
                  className="field__input content-file-input"
                  type="file"
                  accept=".pdf,.docx,.txt,.md"
                  onChange={(event) => handleFileChange(event.target.files?.[0])}
                />
                <span className="content-file-name">
                  {selectedFileName ? `선택 파일: ${selectedFileName}` : "파일을 선택해 주세요."}
                </span>
              </label>

              <label className="field">
                <span className="field__label">저장 경로</span>
                <input
                  className="field__input"
                  value={uploadForm.path}
                  onChange={(event) =>
                    setUploadForm((current) => ({ ...current, path: event.target.value }))
                  }
                  placeholder="/rag/manual/chatbot-guide"
                />
              </label>

              <label className="field">
                <span className="field__label">문서 유형</span>
                <select
                  className="field__input"
                  value={uploadForm.type}
                  onChange={(event) =>
                    setUploadForm((current) => ({
                      ...current,
                      type: event.target.value as ContentDocumentType
                    }))
                  }
                >
                  <option value="MANUAL">매뉴얼</option>
                  <option value="FAQ">FAQ</option>
                </select>
              </label>
            </div>

            <div className="modal__footer">
              <button type="button" className="secondary-button" onClick={closeUploadModal}>
                취소
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={handleUploadSubmit}
                disabled={!canSubmitUpload}
              >
                {uploadMode === "EDIT" ? "수정 저장" : "저장"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isDeleteOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsDeleteOpen(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label="문서 삭제 확인"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal__header">
              <h3>문서 삭제 확인</h3>
              <button type="button" className="icon-button" onClick={() => setIsDeleteOpen(false)}>
                ×
              </button>
            </div>
            <div className="modal__body">
              <p className="content-confirm">
                문서를 삭제하면 목록에서 사라집니다. 이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
            <div className="modal__footer">
              <button type="button" className="secondary-button" onClick={() => setIsDeleteOpen(false)}>
                취소
              </button>
              <button type="button" className="danger-button" onClick={handleDelete}>
                삭제
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
