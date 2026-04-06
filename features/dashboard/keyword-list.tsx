import { SectionHeader } from "@/components/layout/section-header";
import type { KeywordItem } from "@/types/dashboard";
import { formatPercent } from "@/utils/text";

type KeywordListProps = {
  title: string;
  items: KeywordItem[];
  bare?: boolean;
};

export function KeywordList({ title, items, bare }: KeywordListProps) {
  return (
    <section className={`dashboard-keyword-card${bare ? " dashboard-keyword-card--bare" : ""}`}>
      <SectionHeader title={title} className="dashboard-keyword-card__header" />

      {items.length === 0 ? (
        <div className="dashboard-keyword-empty">조건에 맞는 질문 키워드가 없습니다.</div>
      ) : (
        <ol className="keyword-list">
          {items.map((item) => (
            <li key={item.rank} className="keyword-list__item">
              <div className="keyword-list__left">
                <span className="keyword-list__rank">{item.rank}</span>
                <span className="keyword-list__label">{item.label}</span>
              </div>
              <div className="keyword-list__stats">
                <strong className="keyword-list__count">{item.count.toLocaleString()}건</strong>
                <span className="keyword-list__divider">·</span>
                <span className="keyword-list__ratio">{formatPercent(item.ratio)}</span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
