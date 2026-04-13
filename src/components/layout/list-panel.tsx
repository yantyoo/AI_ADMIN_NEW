"use client";

import type { ReactNode } from "react";
import { SectionHeader } from "@/components/layout/section-header";

type ListPanelProps = {
  title: ReactNode;
  actions?: ReactNode;
  toolbar?: ReactNode;
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function ListPanel({
  title,
  actions,
  toolbar,
  footer,
  className,
  children
}: ListPanelProps) {
  return (
    <section className={`list-panel${className ? ` ${className}` : ""}`}>
      <SectionHeader title={title} actions={actions} className="list-panel__header" />

      {toolbar ? <div className="list-panel__toolbar">{toolbar}</div> : null}

      <div className="list-panel__body">{children}</div>

      {footer ? <div className="list-panel__footer">{footer}</div> : null}
    </section>
  );
}
