import type { ReactNode } from "react";

type ToastTone = "success" | "error" | "info";

type ToastStackProps = {
  items: Array<{
    key: string;
    tone: ToastTone;
    message: ReactNode;
  }>;
};

export function ToastStack({ items }: ToastStackProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      {items.map((item) => (
        <div key={item.key} className={`toast toast--${item.tone}`} role="status">
          {item.message}
        </div>
      ))}
    </div>
  );
}
