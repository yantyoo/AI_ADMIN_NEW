import type {
  KnowledgeDocument,
  KnowledgeQueryForm,
  KnowledgeResult,
} from "@/types/knowledge";

const documents: KnowledgeDocument[] = [
  {
    id: "kdoc-001",
    name: "챗봇 운영 매뉴얼",
    type: "MANUAL",
    path: "/rag/manual/chatbot-operations",
  },
  {
    id: "kdoc-002",
    name: "업무 안내서",
    type: "MANUAL",
    path: "/rag/manual/payment-guide",
  },
  {
    id: "kdoc-003",
    name: "FAQ 모음",
    type: "FAQ",
    path: "/rag/faq/common-questions",
  },
  {
    id: "kdoc-004",
    name: "차량등록 FAQ",
    type: "FAQ",
    path: "/rag/faq/vehicle-registration",
  },
];

export async function getKnowledgeInitialData(): Promise<{
  documents: KnowledgeDocument[];
}> {
  return {
    documents,
  };
}

export async function executeKnowledgeQuery(
  form: KnowledgeQueryForm
): Promise<KnowledgeResult | null> {
  const doc = documents.find((d) => d.id === form.documentId);
  if (!doc) return null;

  return {
    answer: `"${form.question}"에 대한 응답입니다.\n\n선택하신 문서(${doc.name})를 기반으로 관련 내용을 조회한 결과, 해당 내용에 대한 예시 응답을 생성했습니다. 실제 API 연동 시에는 정확한 문맥을 기준으로 응답합니다.`,
    generatedAt: "2026-04-02 10:30:00",
    referenceDocument: {
      name: doc.name,
      type: doc.type,
      path: doc.path,
    },
    referenceParagraph: "chunk-042",
  };
}
