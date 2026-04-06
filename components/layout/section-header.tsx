import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: ReactNode;
  actions?: ReactNode;
  className?: string;
  titleAs?: "h2" | "h3" | "h4";
};

export function SectionHeader({ title, actions, className, titleAs = "h2" }: SectionHeaderProps) {
  const TitleTag = titleAs;

  return (
    <div className={`section-header${className ? ` ${className}` : ""}`}>
      <div className="section-header__copy">
        <TitleTag className="section-header__title">{title}</TitleTag>
      </div>
      {actions ? <div className="section-header__actions">{actions}</div> : null}
    </div>
  );
}
