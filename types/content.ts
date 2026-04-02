export type ContentDocumentType = "MANUAL" | "FAQ";
export type ContentDocumentStatus = "ACTIVE" | "FAILED";

export type ContentHistoryItem = {
  id: string;
  version: string;
  actor: string;
  action: string;
  reason: string;
  occurredAt: string;
};

export type ContentDocument = {
  id: string;
  name: string;
  type: ContentDocumentType;
  path: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  status: ContentDocumentStatus;
  fileName: string;
  fileSize: string;
  history: ContentHistoryItem[];
};

export type ContentFilters = {
  keyword: string;
  type: ContentDocumentType | "ALL";
};

export type ContentUploadForm = {
  fileName: string;
  path: string;
  type: ContentDocumentType;
};
