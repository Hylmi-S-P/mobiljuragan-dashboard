"use client";

import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "confirm" | "outline" | "ghost" | "danger";
type Size = "sm" | "md";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-navy text-white shadow-card hover:bg-navy-hover",
  confirm: "bg-teal text-white hover:bg-teal/90",
  outline: "border border-rule-strong bg-surface text-ink hover:bg-canvas",
  ghost: "text-ink-soft hover:bg-navy/5",
  danger: "bg-danger text-white hover:bg-danger/90",
};

/* Semua tinggi minimal 44px supaya target sentuh tetap aman di layar sempit. */
const SIZES: Record<Size, string> = {
  sm: "h-11 px-3 text-sm",
  md: "h-12 px-5 text-sm",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = "primary",
  size = "sm",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    />
  );
}
