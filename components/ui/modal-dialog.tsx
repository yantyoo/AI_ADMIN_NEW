"use client";

import type { ReactNode } from "react";
import { ModalPortal } from "@/components/ui/modal-portal";

type ModalDialogProps = {
  title: ReactNode;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  description?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  compact?: boolean;
  backdropClassName?: string;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  ariaLabel?: string;
};

export function ModalDialog({
  title,
  children,
  onClose,
  footer,
  description,
  size = "md",
  compact,
  backdropClassName,
  className,
  bodyClassName,
  headerClassName,
  footerClassName,
  ariaLabel
}: ModalDialogProps) {
  return (
    <ModalPortal backdropClassName={backdropClassName} onBackdropClick={onClose}>
      <section
        className={`modal modal--${size}${compact ? " modal--compact" : ""}${className ? ` ${className}` : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={`modal__header${headerClassName ? ` ${headerClassName}` : ""}`}>
          <div>
            <h3>{title}</h3>
            {description ? <p>{description}</p> : null}
          </div>
        </div>

        <div className={`modal__body${bodyClassName ? ` ${bodyClassName}` : ""}`}>{children}</div>

        {footer ? <div className={`modal__footer${footerClassName ? ` ${footerClassName}` : ""}`}>{footer}</div> : null}
      </section>
    </ModalPortal>
  );
}
