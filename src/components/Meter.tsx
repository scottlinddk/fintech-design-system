import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn.js";

export interface MeterProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Accessible name; required because the bar itself has no text. */
  label: string;
  /** Current value within `min`..`max`. Values outside are clamped for display. */
  value: number;
  min?: number;
  max?: number;
  /** Optional human-readable value for assistive tech, e.g. "72 of 100". */
  valueText?: string;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi);

/** Horizontal bar for a bounded score or share. Display only: no domain logic. */
export function Meter({
  label,
  value,
  min = 0,
  max = 100,
  valueText,
  className,
  ...props
}: MeterProps) {
  const span = max - min;
  const ratio = span > 0 ? clamp((value - min) / span, 0, 1) : 0;
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={clamp(value, min, max)}
      aria-valuetext={valueText}
      className={cn("fds-meter", className)}
      {...props}
    >
      <div className="fds-meter__fill" style={{ width: `${ratio * 100}%` }} />
    </div>
  );
}

export interface SegmentedMeterProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  label: string;
  /** Number of filled segments. */
  value: number;
  segments?: number;
  valueText?: string;
}

/** Discrete scale (for example a 1-7 risk indicator). */
export function SegmentedMeter({
  label,
  value,
  segments = 7,
  valueText,
  className,
  ...props
}: SegmentedMeterProps) {
  const filled = clamp(Math.round(value), 0, segments);
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={segments}
      aria-valuenow={filled}
      aria-valuetext={valueText}
      className={cn("fds-segmeter", className)}
      {...props}
    >
      {Array.from({ length: segments }, (_, index) => (
        <span
          key={index}
          className={cn("fds-segmeter__segment", index < filled && "fds-segmeter__segment--on")}
        />
      ))}
    </div>
  );
}

export interface DistributionItem {
  label: ReactNode;
  value: number;
}

export interface DistributionListProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  items: readonly DistributionItem[];
  /** Maximum rows shown; the remainder is summarised via `renderOverflow`. */
  limit?: number;
  /** Formats the value text. Consumer owns units and locale. */
  formatValue?: (value: number) => ReactNode;
  /** Shown when there is nothing positive to display. */
  empty?: ReactNode;
  renderOverflow?: (hidden: number) => ReactNode;
}

/** Ranked list of share bars, scaled relative to the largest row. */
export function DistributionList({
  items,
  limit = 5,
  formatValue = (v) => String(v),
  empty,
  renderOverflow,
  className,
  ...props
}: DistributionListProps) {
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const top = sorted.slice(0, limit);
  const max = top[0]?.value ?? 0;
  if (max <= 0) return empty ? <p className="fds-distribution__empty">{empty}</p> : null;
  const hidden = sorted.length - top.length;
  return (
    <div className={cn("fds-distribution", className)} {...props}>
      <ul className="fds-distribution__list">
        {top.map((item, index) => (
          <li key={index} className="fds-distribution__row">
            <div className="fds-distribution__meta">
              <span className="fds-distribution__label">{item.label}</span>
              <span className="fds-distribution__value">{formatValue(item.value)}</span>
            </div>
            <div aria-hidden="true" className="fds-meter fds-meter--thin">
              <div
                className="fds-meter__fill"
                style={{ width: `${(Math.max(item.value, 0) / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      {hidden > 0 && renderOverflow ? (
        <p className="fds-distribution__overflow">{renderOverflow(hidden)}</p>
      ) : null}
    </div>
  );
}
