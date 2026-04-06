export type KnowledgeDocumentType = "MANUAL" | "FAQ";
export type KnowledgeVerdict = "PASS" | "FAIL";

export type KnowledgeDataSource = {
  id: string;
  name: string;
  type: KnowledgeDocumentType;
};

export type KnowledgeDocument = {
  id: string;
  name: string;
  type: KnowledgeDocumentType;
  dataSourceId: string;
  path: string;
};

export type KnowledgeQueryForm = {
  question: string;
  documentType: KnowledgeDocumentType | "";
  dataSourceId: string;
  documentId: string;
};

export type KnowledgeResult = {
  answer: string;
  generatedAt: string;
  referenceDocument: {
    name: string;
    type: KnowledgeDocumentType;
    path: string;
  };
  referenceParagraph: string;
};

export type KnowledgeTestHistory = {
  id: string;
  question: string;
  documentName: string;
  documentType: KnowledgeDocumentType;
  executedAt: string;
  verdict: KnowledgeVerdict | null;
  memo: string | null;
};
