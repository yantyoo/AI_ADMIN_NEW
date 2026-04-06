export type KnowledgeDocumentType = "MANUAL" | "FAQ";

export type KnowledgeDocument = {
  id: string;
  name: string;
  type: KnowledgeDocumentType;
  path: string;
};

export type KnowledgeQueryForm = {
  question: string;
  documentType: KnowledgeDocumentType | "";
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
