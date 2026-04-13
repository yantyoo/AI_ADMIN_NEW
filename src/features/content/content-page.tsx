import { getContentDocuments } from "@/api/content";
import { ContentPanel } from "@/features/content/content-panel";

export async function ContentPage() {
  const documents = await getContentDocuments();

  return <ContentPanel documents={documents} />;
}
