import type {
  HTMLAttributes,
  ReactNode,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";
import { cn } from "../lib/cn.js";

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  /** Visible caption; also the accessible name of the scroll region. */
  caption: ReactNode;
  /** 48px rows by default, 32px when compact. */
  density?: "comfortable" | "compact";
  /** Accessible name for the scroll region when the caption is not a plain string. */
  label?: string;
  /** Applied to the scroll container, e.g. a max-height so the header stays sticky. */
  wrapClassName?: string;
}

/**
 * Semantic table in a keyboard-scrollable region with a sticky header. Pass pre-formatted values;
 * sorting, filtering and pagination state belong to the app (e.g. TanStack Table).
 */
export function Table({
  caption,
  density = "comfortable",
  label,
  wrapClassName,
  className,
  children,
  ...props
}: TableProps) {
  return (
    <div
      role="region"
      aria-label={label ?? (typeof caption === "string" ? caption : undefined)}
      tabIndex={0}
      className={cn("fds-table-wrap", wrapClassName)}
    >
      <table className={cn("fds-table", `fds-table--${density}`, className)} {...props}>
        <caption className="fds-table__caption">{caption}</caption>
        {children}
      </table>
    </div>
  );
}

export const TableHead = (props: HTMLAttributes<HTMLTableSectionElement>) => <thead {...props} />;
export const TableBody = (props: HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />;
export const TableRow = (props: HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />;

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  /** Right-align and use tabular numerals; for figures. */
  numeric?: boolean;
}

export function TableCell({ numeric, ...props }: TableCellProps) {
  return (
    <td
      data-align={numeric ? "end" : undefined}
      data-numeric={numeric ? "" : undefined}
      {...props}
    />
  );
}

export interface TableHeaderCellProps extends Omit<
  ThHTMLAttributes<HTMLTableCellElement>,
  "onClick"
> {
  numeric?: boolean;
  /** Sort state of this column; pair with `onSort` to make the header a button. */
  sort?: "ascending" | "descending" | "none";
  onSort?: () => void;
}

/** Column header. With `onSort`, renders a button and sets `aria-sort`; direction shows as text glyph plus state. */
export function TableHeaderCell({
  numeric,
  sort,
  onSort,
  scope = "col",
  children,
  ...props
}: TableHeaderCellProps) {
  const glyph = sort === "ascending" ? "↑" : sort === "descending" ? "↓" : "↕";
  return (
    <th scope={scope} aria-sort={sort} data-align={numeric ? "end" : undefined} {...props}>
      {onSort ? (
        <button type="button" className="fds-table__sort" onClick={onSort}>
          {children}
          <span aria-hidden="true" className="fds-table__sort-icon">
            {glyph}
          </span>
        </button>
      ) : (
        children
      )}
    </th>
  );
}
