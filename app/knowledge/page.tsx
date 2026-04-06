import { getKnowledgeInitialData } from "@/api/knowledge";
import { KnowledgePanel } from "@/features/knowledge/knowledge-panel";

export default async function Page() {
  const { documents } = await getKnowledgeInitialData();

  return <KnowledgePanel documents={documents} />;
}
