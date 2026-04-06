type TopHeaderProps = {
  title: string;
  description: string;
};

export function TopHeader({ title }: TopHeaderProps) {
  return (
    <header className="top-header">
      <div>
        <h1 className="top-header__title">{title}</h1>
      </div>
    </header>
  );
}
