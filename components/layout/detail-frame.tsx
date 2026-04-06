import type { ReactNode } from "react";
import { SectionHeader } from "@/components/layout/section-header";

type DetailFrameProps = {
  title: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  titleAs?: "h2" | "h3";
};

export function DetailFrame({
  title,
  actions,
  children,
  className,
  bodyClassName,
  titleAs = "h3"
}: DetailFrameProps) {
  return (
    <section className={`detail-frame${className ? ` ${className}` : ""}`}>
      <SectionHeader
        title={title}
        actions={actions}
        className="detail-frame__header"
        titleAs={titleAs}
      />
      <div className={`detail-frame__body${bodyClassName ? ` ${bodyClassName}` : ""}`}>{children}</div>
    </section>
  );
}
