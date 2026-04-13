import { getPlaceholderSpec } from "@/api/placeholder";
import { pageMetaByPath } from "@/features/layout/config";

type PlaceholderPageProps = {
  path: string;
};

export function PlaceholderPage({ path }: PlaceholderPageProps) {
  const pageMeta = pageMetaByPath[path] ?? pageMetaByPath["/"];
  const spec = getPlaceholderSpec(pageMeta.title, pageMeta.description);

  return (
    <section className="panel panel--placeholder">
      <h2 className="panel__title">{spec.title}</h2>
      <div className="placeholder-state">
        <strong>구현 보류</strong>
        <p>{spec.blockedReason}</p>
      </div>
    </section>
  );
}
