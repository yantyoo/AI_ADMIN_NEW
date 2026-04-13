import type { ContentDocument, ContentDocumentType } from "@/types/content";

export const contentDocumentsSeed: ContentDocument[] = [
  {
    id: "doc-001",
    name: "챗봇 운영 매뉴얼",
    type: "MANUAL",
    path: "/rag/manual/chatbot-operations",
    author: "박운영",
    createdAt: "2026-03-28 09:10",
    updatedAt: "2026-04-01 14:22",
    status: "ACTIVE",
    fileName: "chatbot-operations.pdf",
    fileSize: "12.4MB",
    history: [
      {
        id: "hist-001",
        version: "v3",
        actor: "박운영",
        action: "수정",
        reason: "업무 프로세스 변경 반영",
        occurredAt: "2026-04-01 14:22"
      },
      {
        id: "hist-002",
        version: "v2",
        actor: "김관리",
        action: "업로드",
        reason: "초기 반영",
        occurredAt: "2026-03-28 09:10"
      }
    ]
  },
  {
    id: "doc-002",
    name: "FAQ 응답 모음",
    type: "FAQ",
    path: "/rag/faq/common-questions",
    author: "박운영",
    createdAt: "2026-03-30 11:05",
    updatedAt: "2026-04-02 10:40",
    status: "ACTIVE",
    fileName: "faq-collection.docx",
    fileSize: "2.1MB",
    history: [
      {
        id: "hist-003",
        version: "v2",
        actor: "박운영",
        action: "수정",
        reason: "질문 분류 보완",
        occurredAt: "2026-04-02 10:40"
      }
    ]
  },
  {
    id: "doc-003",
    name: "수납 안내서",
    type: "MANUAL",
    path: "/rag/manual/payment-guide",
    author: "김관리",
    createdAt: "2026-03-25 16:20",
    updatedAt: "2026-03-29 08:15",
    status: "ACTIVE",
    fileName: "payment-guide.md",
    fileSize: "0.8MB",
    history: [
      {
        id: "hist-004",
        version: "v1",
        actor: "김관리",
        action: "업로드",
        reason: "신규 등록",
        occurredAt: "2026-03-25 16:20"
      }
    ]
  },
  {
    id: "doc-004",
    name: "차량등록 FAQ",
    type: "FAQ",
    path: "/rag/faq/vehicle-registration",
    author: "박운영",
    createdAt: "2026-03-20 13:35",
    updatedAt: "2026-03-20 13:35",
    status: "FAILED",
    fileName: "vehicle-registration.txt",
    fileSize: "0.2MB",
    history: [
      {
        id: "hist-005",
        version: "v1",
        actor: "박운영",
        action: "업로드 실패",
        reason: "파싱 오류",
        occurredAt: "2026-03-20 13:35"
      }
    ]
  }
];

export async function getContentDocuments(): Promise<ContentDocument[]> {
  return contentDocumentsSeed.slice().sort((left, right) => {
    return right.updatedAt.localeCompare(left.updatedAt) || right.createdAt.localeCompare(left.createdAt);
  });
}

export async function uploadContentDocument(input: {
  fileName: string;
  path: string;
  type: ContentDocumentType;
}): Promise<ContentDocument> {
  return {
    id: `doc-${Date.now()}`,
    name: input.fileName.replace(/\.[^.]+$/, ""),
    type: input.type,
    path: input.path,
    author: "박운영",
    createdAt: "2026-04-02 09:00",
    updatedAt: "2026-04-02 09:00",
    status: "ACTIVE",
    fileName: input.fileName,
    fileSize: "0MB",
    history: [
      {
        id: `hist-${Date.now()}`,
        version: "v1",
        actor: "박운영",
        action: "업로드",
        reason: "신규 등록",
        occurredAt: "2026-04-02 09:00"
      }
    ]
  };
}
