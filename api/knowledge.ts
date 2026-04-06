import type {
  KnowledgeDataSource,
  KnowledgeDocument,
  KnowledgeQueryForm,
  KnowledgeResult,
  KnowledgeTestHistory,
} from "@/types/knowledge";

const dataSources: KnowledgeDataSource[] = [
  { id: "ds-001", name: "XpERP 매뉴얼 DB", type: "MANUAL" },
  { id: "ds-002", name: "업무 프로세스 DB", type: "MANUAL" },
  { id: "ds-003", name: "공통 FAQ DB", type: "FAQ" },
  { id: "ds-004", name: "세부 FAQ DB", type: "FAQ" },
];

const documents: KnowledgeDocument[] = [
  {
    id: "kdoc-001",
    name: "챗봇 운영 매뉴얼",
    type: "MANUAL",
    dataSourceId: "ds-001",
    path: "/rag/manual/chatbot-operations",
  },
  {
    id: "kdoc-002",
    name: "업무 안내서",
    type: "MANUAL",
    dataSourceId: "ds-002",
    path: "/rag/manual/payment-guide",
  },
  {
    id: "kdoc-003",
    name: "FAQ 모음",
    type: "FAQ",
    dataSourceId: "ds-003",
    path: "/rag/faq/common-questions",
  },
  {
    id: "kdoc-004",
    name: "차량등록 FAQ",
    type: "FAQ",
    dataSourceId: "ds-004",
    path: "/rag/faq/vehicle-registration",
  },
];

const testHistories: KnowledgeTestHistory[] = [
  {
    id: "th-001",
    question: "업무 방법을 알려줘",
    documentName: "업무 안내서",
    documentType: "MANUAL",
    executedAt: "2026-04-01 11:20",
    verdict: "PASS",
    memo: null,
  },
  {
    id: "th-002",
    question: "차량등록 안내를 보여줘",
    documentName: "차량등록 FAQ",
    documentType: "FAQ",
    executedAt: "2026-04-01 13:45",
    verdict: "FAIL",
    memo: "등록 안내의 단계가 실제 화면과 다름",
  },
  {
    id: "th-003",
    question: "챗봇 응답 정책은 어떻게 되나",
    documentName: "챗봇 운영 매뉴얼",
    documentType: "MANUAL",
    executedAt: "2026-04-02 09:10",
    verdict: null,
    memo: null,
  },
];

const compareExecutedAtDesc = (left: KnowledgeTestHistory, right: KnowledgeTestHistory) =>
  right.executedAt.localeCompare(left.executedAt);

export async function getKnowledgeInitialData(): Promise<{
  dataSources: KnowledgeDataSource[];
  documents: KnowledgeDocument[];
  testHistories: KnowledgeTestHistory[];
}> {
  return {
    dataSources,
    documents,
    testHistories: testHistories.slice().sort(compareExecutedAtDesc),
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
