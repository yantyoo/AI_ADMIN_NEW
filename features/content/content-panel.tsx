"use client";

import { useMemo, useRef, useState } from "react";
import { uploadContentDocument } from "@/api/content";
import { DetailFrame } from "@/components/layout/detail-frame";
import { SectionHeader } from "@/components/layout/section-header";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { ToastStack } from "@/components/ui/toast-stack";
import { useAutoDismissMessage } from "@/hooks/use-auto-dismiss-message";
import {
  CONTENT_DOCUMENT_STATUS_LABELS,
  CONTENT_DOCUMENT_TYPE_OPTIONS,
  CONTENT_TOAST_DISMISS_MS,
  CONTENT_UPLOAD_FILE_ACCEPT,
  DEFAULT_CONTENT_UPLOAD_FORM
} from "@/constants/content";
import type {
  ContentDocument,
  ContentDocumentType,
  ContentFilters,
  ContentUploadForm
} from "@/types/content";
import { compareStringDesc } from "@/utils/text";

type ContentPanelProps = {
  documents: ContentDocument[];
};

type UploadMode = "CREATE" | "EDIT";

const compareDocumentDesc = (left: ContentDocument, right: ContentDocument) =>
  compareStringDesc(left.updatedAt, right.updatedAt) ||
  compareStringDesc(left.createdAt, right.createdAt);

export function ContentPanel({ documents }: ContentPanelProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const initialDocuments = documents.slice().sort(compareDocumentDesc);
  const [filters, setFilters] = useState<ContentFilters>({ keyword: "", type: "ALL" });
  const [searchDraft, setSearchDraft] = useState("");
  const [localDocuments, setLocalDocuments] = useState(() => initialDocuments);
  const [selectedDocumentId, setSelectedDocumentId] = useState(initialDocuments[0]?.id ?? "");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<UploadMode>("CREATE");
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);
  const uploadMessageState = useAutoDismissMessage(CONTENT_TOAST_DISMISS_MS);
  const errorMessageState = useAutoDismissMessage(CONTENT_TOAST_DISMISS_MS);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [uploadForm, setUploadForm] = useState<ContentUploadForm>(DEFAULT_CONTENT_UPLOAD_FORM);

  const filteredDocuments = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();

    return localDocuments
      .filter((document) => {
        const keywordMatch =
          keyword.length === 0 ||
          document.name.toLowerCase().includes(keyword) ||
          document.path.toLowerCase().includes(keyword);
        const typeMatch = filters.type === "ALL" || document.type === filters.type;

        return keywordMatch && typeMatch;
      })
      .sort(compareDocumentDesc);
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

  const resetSearch = () => {
    setSearchDraft("");
    setFilters((current) => ({ ...current, keyword: "", type: "ALL" }));
  };

  const openCreateModal = () => {
    setUploadMode("CREATE");
    setEditingDocumentId(null);
    setUploadForm(DEFAULT_CONTENT_UPLOAD_FORM);
    setSelectedFileName("");
    errorMessageState.clearMessage();
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
    errorMessageState.clearMessage();
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
      errorMessageState.showMessage("파일과 경로를 모두 입력해 주세요.");
      return;
    }

    const submitted = await uploadContentDocument(uploadForm);
    const timestamp = new Date().toLocaleString("sv-SE").slice(0, 16).replace("T", " ");

    if (uploadMode === "CREATE" || !editingDocumentId) {
      const createdDocument: ContentDocument = {
        ...submitted,
        status: "ACTIVE" as const,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      const nextDocuments = [createdDocument, ...localDocuments].sort(compareDocumentDesc);

      setLocalDocuments(nextDocuments);
      setSelectedDocumentId(submitted.id);
      uploadMessageState.showMessage("문서 업로드가 완료되었습니다.");
    } else {
      setLocalDocuments((current) =>
        current
          .map((document) => {
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
              status: "ACTIVE" as const,
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
          .sort(compareDocumentDesc)
      );
      setSelectedDocumentId(editingDocumentId);
      uploadMessageState.showMessage("문서가 수정되었습니다.");
    }

    errorMessageState.clearMessage();
    closeUploadModal();
    setUploadForm(DEFAULT_CONTENT_UPLOAD_FORM);
  };

  const handleDelete = () => {
    if (!selectedDocument) return;

    setLocalDocuments((current) => {
      const nextDocuments = current
        .filter((document) => document.id !== selectedDocument.id)
        .sort(compareDocumentDesc);
      setSelectedDocumentId(nextDocuments[0]?.id ?? "");
      return nextDocuments;
    });
    setIsDeleteOpen(false);
    uploadMessageState.showMessage("문서 삭제가 완료되었습니다.");
  };

  const handleDownload = () => {
    if (!selectedDocument) return;
    uploadMessageState.showMessage("문서 다운로드를 준비했습니다.");
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

  const toastItems = [
    ...(uploadMessageState.message
      ? [{ key: "content-success", tone: "success" as const, message: uploadMessageState.message }]
      : []),
    ...(errorMessageState.message
      ? [{ key: "content-error", tone: "error" as const, message: errorMessageState.message }]
      : [])
  ];

  return (
    <div className="page-content page-content--fill content-page">
      <ToastStack items={toastItems} />

      <div className="content-grid">
        <section className="content-table-card">
          <SectionHeader
            title="문서 목록"
            actions={
              <button type="button" className="primary-button" onClick={openCreateModal}>
                문서 업로드
              </button>
            }
            className="content-table-card__header content-table-card__header--list"
          />
            <form
            className="content-toolbar content-toolbar--content content-table-card__toolbar"
            onSubmit={(event) => {
              event.preventDefault();
              applySearch();
            }}
          >
            <label className="field content-toolbar__field content-toolbar__field--select">
                <span className="field__label">문서 유형</span>
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
                {CONTENT_DOCUMENT_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field content-toolbar__field content-toolbar__field--search">
              <span className="field__label">문서명 검색</span>
              <input
                className="field__input"
                type="search"
                value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
                placeholder="2자 이상 입력"
              />
            </label>

            <div className="content-toolbar__actions">
              <button type="submit" className="primary-button content-toolbar__button">
                검색
              </button>
              <button
                type="button"
                className="secondary-button content-toolbar__button"
                onClick={resetSearch}
              >
                초기화
              </button>
            </div>
          </form>

          <div className="content-table-scroll">
            <table className="content-table">
              <thead>
                <tr>
                  <th>문서명</th>
                  <th>유형</th>
                  <th>등록자</th>
                  <th>등록일</th>
                  <th>수정일</th>
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
                          {CONTENT_DOCUMENT_STATUS_LABELS[document.status]}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <DetailFrame
          className="content-detail-card"
          title="문서 상세"
          actions={
            selectedDocument ? (
              <span className={`status-badge status-badge--${selectedDocument.status.toLowerCase()}`}>
                {CONTENT_DOCUMENT_STATUS_LABELS[selectedDocument.status]}
              </span>
            ) : null
          }
        >
          {selectedDocument ? (
            <div className="content-detail-scroll">
              <div className="content-detail__name-card">
                <div className="content-detail__identity">
                  <h3 className="content-detail__title">{selectedDocument.name}</h3>
                  <span className="content-detail__type-pill">
                    {selectedDocument.type === "MANUAL" ? "매뉴얼" : "FAQ"}
                  </span>
                </div>
              </div>

              <dl className="content-detail__list">
                <div>
                  <dt>저장 경로</dt>
                  <dd>{selectedDocument.path}</dd>
                </div>
                <div>
                  <dt>파일 크기</dt>
                  <dd>{selectedDocument.fileSize}</dd>
                </div>
                <div>
                  <dt>등록자</dt>
                  <dd>{selectedDocument.author}</dd>
                </div>
                <div>
                  <dt>등록일</dt>
                  <dd>{selectedDocument.createdAt}</dd>
                </div>
                <div>
                  <dt>수정자</dt>
                  <dd>{selectedDocument.history[0]?.actor ?? selectedDocument.author}</dd>
                </div>
                <div>
                  <dt>수정일</dt>
                  <dd>{selectedDocument.updatedAt}</dd>
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
            <div className="content-empty content-empty--detail">선택한 문서가 없습니다.</div>
          )}
        </DetailFrame>
      </div>

      {isUploadOpen ? (
        <ModalDialog
          title={uploadMode === "EDIT" ? "문서 수정 업로드" : "문서 업로드"}
          ariaLabel={uploadMode === "EDIT" ? "문서 수정 업로드" : "문서 업로드"}
          onClose={closeUploadModal}
          size="lg"
          footer={
            <>
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
            </>
          }
        >
          <label className="field">
            <span className="field__label">파일 선택 *</span>
            <input
              ref={fileInputRef}
              className="field__input content-file-input"
              type="file"
              accept={CONTENT_UPLOAD_FILE_ACCEPT}
              onChange={(event) => handleFileChange(event.target.files?.[0])}
            />
            <span className="content-file-name">
              {selectedFileName ? `선택한 파일: ${selectedFileName}` : "파일을 선택해 주세요."}
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
        </ModalDialog>
      ) : null}

      {isDeleteOpen ? (
        <ModalDialog
          title="문서 삭제 확인"
          ariaLabel="문서 삭제 확인"
          onClose={() => setIsDeleteOpen(false)}
          size="sm"
          footer={
            <>
              <button type="button" className="secondary-button" onClick={() => setIsDeleteOpen(false)}>
                취소
              </button>
              <button type="button" className="danger-button" onClick={handleDelete}>
                삭제
              </button>
            </>
          }
        >
          <p className="content-confirm">
            문서를 삭제하면 목록에서 사라집니다. 복구 작업은 별도로 제공되지 않습니다.
          </p>
        </ModalDialog>
      ) : null}
    </div>
  );
}
