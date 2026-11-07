import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn.js";

export type Tone = "neutral" | "accent" | "success" | "warn" | "danger";

export interface MetricProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  /** Pre-formatted value. Formatting and calculation belong to the consuming app. */
  value: ReactNode;
  tone?: Tone;
}

/** Label/value tile for pre-formatted figures. Does no number formatting or arithmetic. */
export function Metric({ label, value, tone = "neutral", className, ...props }: MetricProps) {
  return (
    <div className={cn("fds-metric", className)} {...props}>
      <p className="fds-metric__label">{label}</p>
      <p className={cn("fds-metric__value", `fds-tone--${tone}`)}>{value}</p>
    </div>
  );
}

export interface KeyValueProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
}

/** Quieter label/value pair for detail views. */
export function KeyValue({ label, value, className, ...props }: KeyValueProps) {
  return (
    <div className={cn("fds-keyvalue", className)} {...props}>
      <p className="fds-metric__label">{label}</p>
      <p className="fds-keyvalue__value">{value}</p>
    </div>
  );
}
