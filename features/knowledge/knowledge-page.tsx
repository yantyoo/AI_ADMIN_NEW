import { getKnowledgeInitialData } from "@/api/knowledge";
import { KnowledgePanel } from "@/features/knowledge/knowledge-panel";

export async function KnowledgePage() {
  const { documents } = await getKnowledgeInitialData();

  return <KnowledgePanel documents={documents} />;
}
