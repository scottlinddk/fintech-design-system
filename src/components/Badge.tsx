import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn.js";
import type { Tone } from "./Metric.js";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  icon?: ReactNode;
}

/** Compact status/label chip. Never rely on tone alone: include meaningful text. */
export function Badge({ tone = "neutral", icon, className, children, ...props }: BadgeProps) {
  return (
    <span className={cn("fds-badge", `fds-badge--${tone}`, className)} {...props}>
      {icon ? (
        <span aria-hidden="true" className="fds-badge__icon">
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
}
