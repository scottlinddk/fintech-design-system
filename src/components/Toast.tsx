import { useEffect, useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn.js";

export interface ToastAction {
  label: string;
  onSelect: () => void;
}

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: "info" | "success" | "warn" | "danger";
  title?: ReactNode;
  /** Typically "Undo". Prefer undo toasts over confirm dialogs for reversible actions. */
  action?: ToastAction;
  /** Called on dismiss, after the action, and when `duration` elapses. */
  onDismiss?: () => void;
  /** Auto-dismiss in ms; 0 keeps it until dismissed. Defaults to 8000, or 0 for `danger`. Pauses on hover and focus. */
  duration?: number;
  dismissLabel?: string;
}

/** Transient message with optional undo. Controlled: the app owns the list and removes it in `onDismiss`. */
export function Toast({
  tone = "info",
  title,
  action,
  onDismiss,
  duration,
  dismissLabel = "Dismiss",
  className,
  children,
  role,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...props
}: ToastProps) {
  const [paused, setPaused] = useState(false);
  const ms = duration ?? (tone === "danger" ? 0 : 8000);

  useEffect(() => {
    if (!onDismiss || ms <= 0 || paused) return;
    const timer = setTimeout(onDismiss, ms);
    return () => clearTimeout(timer);
  }, [onDismiss, ms, paused]);

  return (
    <div
      role={role ?? (tone === "danger" ? "alert" : "status")}
      className={cn("fds-toast", `fds-toast--${tone}`, className)}
      onMouseEnter={(event) => {
        setPaused(true);
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        setPaused(false);
        onMouseLeave?.(event);
      }}
      onFocus={(event) => {
        setPaused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setPaused(false);
        onBlur?.(event);
      }}
      {...props}
    >
      <div className="fds-toast__body">
        {title ? <p className="fds-toast__title">{title}</p> : null}
        {children ? <div className="fds-toast__text">{children}</div> : null}
      </div>
      {action ? (
        <button
          type="button"
          className="fds-button fds-button--ghost"
          onClick={() => {
            action.onSelect();
            onDismiss?.();
          }}
        >
          {action.label}
        </button>
      ) : null}
      {onDismiss ? (
        <button
          type="button"
          aria-label={dismissLabel}
          className="fds-button fds-button--ghost fds-toast__dismiss"
          onClick={onDismiss}
        >
          <span aria-hidden="true">×</span>
        </button>
      ) : null}
    </div>
  );
}

export interface ToastRegionProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
}

/** Fixed, safe-area-aware stack for toasts. Render one per app, near the root. */
export function ToastRegion({
  label = "Notifications",
  className,
  children,
  ...props
}: ToastRegionProps) {
  return (
    <div role="region" aria-label={label} className={cn("fds-toast-region", className)} {...props}>
      {children}
    </div>
  );
}
