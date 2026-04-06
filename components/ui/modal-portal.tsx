"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ModalPortalProps = Readonly<{
  children: React.ReactNode;
  backdropClassName?: string;
  onBackdropClick?: () => void;
}>;

export function ModalPortal({ children, backdropClassName, onBackdropClick }: ModalPortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className={backdropClassName ? `modal-backdrop ${backdropClassName}` : "modal-backdrop"}
      role="presentation"
      onClick={onBackdropClick}
    >
      {children}
    </div>,
    document.body
  );
}
