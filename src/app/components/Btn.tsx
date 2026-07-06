import React from "react";
import { cx } from "@/app/lib/utils";

export function Btn({ children, variant = "primary", size = "md", onClick, className, disabled }: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  const base = "inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-150 cursor-pointer";
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
  const variants = {
    primary:   "bg-primary text-white hover:opacity-90 active:scale-[0.98] shadow-sm",
    secondary: "bg-secondary text-secondary-foreground hover:opacity-80",
    ghost:     "text-muted-foreground hover:text-foreground hover:bg-accent",
    danger:    "bg-destructive text-destructive-foreground hover:opacity-90",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cx(base, sizes[size], variants[variant], disabled && "opacity-50 cursor-not-allowed", className)}
    >
      {children}
    </button>
  );
}
