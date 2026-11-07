import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn.js";

export interface NoticeProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: "info" | "success" | "warn" | "danger";
  title?: ReactNode;
  action?: ReactNode;
}

/** Inline message. `danger` announces as an alert; other tones as polite status. */
export function Notice({
  tone = "info",
  title,
  action,
  className,
  children,
  role,
  ...props
}: NoticeProps) {
  return (
    <div
      role={role ?? (tone === "danger" ? "alert" : "status")}
      className={cn("fds-notice", `fds-notice--${tone}`, className)}
      {...props}
    >
      <div className="fds-notice__body">
        {title ? <p className="fds-notice__title">{title}</p> : null}
        {children ? <div className="fds-notice__text">{children}</div> : null}
      </div>
      {action ? <div className="fds-notice__action">{action}</div> : null}
    </div>
  );
}

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

/** Placeholder for lists or panels with no data, with an optional next step. */
export function EmptyState({ title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div className={cn("fds-empty", className)} {...props}>
      <p className="fds-empty__title">{title}</p>
      {description ? <p className="fds-empty__description">{description}</p> : null}
      {action ? <div className="fds-empty__action">{action}</div> : null}
    </div>
  );
}
