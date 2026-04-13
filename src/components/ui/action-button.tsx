"use client";

import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

type ActionButtonVariant = "primary" | "secondary" | "danger";

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant: ActionButtonVariant;
  width?: number;
  height?: number;
};

export function ActionButton({
  children,
  className,
  variant,
  width = 120,
  height = 40,
  style,
  ...props
}: ActionButtonProps) {
  const mergedStyle: CSSProperties = {
    width,
    height,
    ...style
  };

  return (
    <button
      className={`${variant}-button${className ? ` ${className}` : ""}`}
      style={mergedStyle}
      {...props}
    >
      {children}
    </button>
  );
}
