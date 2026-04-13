import { getCacheQaInitialData } from "@/api/cache-qa";
import { CacheQaPanel } from "@/features/cache-qa/cache-qa-panel";

export async function CacheQaPage() {
  const { items } = await getCacheQaInitialData();

  return (
    <div className="page-content page-content--fill">
      <CacheQaPanel items={items} />
    </div>
  );
}
