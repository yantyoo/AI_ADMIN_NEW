import type { ContentDocument, ContentDocumentType, ContentUploadForm } from "@/types/content";

export const CONTENT_DOCUMENT_TYPE_OPTIONS: Array<{ label: string; value: ContentDocumentType | "ALL" }> = [
  { label: "전체", value: "ALL" },
  { label: "매뉴얼", value: "MANUAL" },
  { label: "FAQ", value: "FAQ" }
];

export const CONTENT_DOCUMENT_STATUS_LABELS: Record<ContentDocument["status"], string> = {
  ACTIVE: "정상",
  FAILED: "실패"
};

export const DEFAULT_CONTENT_UPLOAD_FORM: ContentUploadForm = {
  fileName: "",
  path: "",
  type: "MANUAL"
};

export const CONTENT_UPLOAD_FILE_ACCEPT = ".pdf,.docx,.txt,.md";

export const CONTENT_TOAST_DISMISS_MS = 3000;
