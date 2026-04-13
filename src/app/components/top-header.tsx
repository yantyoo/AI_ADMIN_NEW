import type { ReactNode } from "react";

type TopHeaderProps = {
  title: string;
  description?: string;
  rightSlot?: ReactNode;
};

export function TopHeader({ title, description, rightSlot }: TopHeaderProps) {
  return (
    <header className="top-header">
      <div className="top-header__copy">
        <h1 className="top-header__title">{title}</h1>
        {description ? <p className="top-header__description">{description}</p> : null}
      </div>
      {rightSlot ? <div className="top-header__slot">{rightSlot}</div> : null}
    </header>
  );
}
