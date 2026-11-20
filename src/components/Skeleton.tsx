import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn.js";

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  shape?: "text" | "rect" | "circle";
  /** CSS length, or a number of pixels. */
  width?: string | number;
  height?: string | number;
}

/** Decorative loading placeholder. Hidden from assistive tech; announce loading with `SkeletonGroup`. */
export function Skeleton({
  shape = "text",
  width,
  height,
  className,
  style,
  ...props
}: SkeletonProps) {
  const size: CSSProperties = { width, height, ...style };
  return (
    <span
      aria-hidden="true"
      className={cn("fds-skeleton", `fds-skeleton--${shape}`, className)}
      style={size}
      {...props}
    />
  );
}

export interface SkeletonTextProps extends HTMLAttributes<HTMLSpanElement> {
  lines?: number;
}

/** Paragraph placeholder; the last line is shorter. */
export function SkeletonText({ lines = 3, className, ...props }: SkeletonTextProps) {
  return (
    <span aria-hidden="true" className={cn("fds-skeleton-text", className)} {...props}>
      {Array.from({ length: Math.max(1, lines) }, (_, index) => (
        <Skeleton key={index} />
      ))}
    </span>
  );
}

export interface SkeletonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Announced to screen readers while loading. */
  label?: ReactNode;
}

/** Wraps skeletons: marks the region busy and announces `label` politely. Remove it when data arrives. */
export function SkeletonGroup({
  label = "Loading",
  className,
  children,
  ...props
}: SkeletonGroupProps) {
  return (
    <div role="status" aria-busy="true" className={cn("fds-skeleton-group", className)} {...props}>
      <span className="fds-skeleton-group__label">{label}</span>
      {children}
    </div>
  );
}
