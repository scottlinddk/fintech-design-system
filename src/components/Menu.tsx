import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "../lib/cn.js";

export interface MenuItem {
  label: string;
  tone?: "danger";
  disabled?: boolean;
  onSelect: () => void;
}

export interface MenuProps {
  /** Accessible name of the trigger button. */
  ariaLabel: string;
  items: readonly MenuItem[];
  /** Trigger content. Defaults to a vertical-ellipsis glyph. */
  trigger?: ReactNode;
  className?: string;
}

/** Action menu: closes on outside press and Escape (returning focus), arrow-key navigation. */
export function Menu({ ariaLabel, items, trigger, className }: MenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  useEffect(() => {
    if (open)
      rootRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not(:disabled)')?.focus();
  }, [open]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!open) return;
    if (event.key === "Escape") {
      event.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    const enabled = Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)') ?? [],
    );
    if (enabled.length === 0) return;
    const current = enabled.indexOf(document.activeElement as HTMLElement);
    const move = (next: number) => {
      event.preventDefault();
      enabled[(next + enabled.length) % enabled.length]?.focus();
    };
    if (event.key === "ArrowDown") move(current + 1);
    else if (event.key === "ArrowUp") move(current < 0 ? enabled.length - 1 : current - 1);
    else if (event.key === "Home") move(0);
    else if (event.key === "End") move(enabled.length - 1);
    else if (event.key === "Tab") setOpen(false);
  };

  return (
    <div className={cn("fds-menu", className)} onKeyDown={onKeyDown} ref={rootRef}>
      <button
        aria-controls={open ? menuId : undefined}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={ariaLabel}
        className="fds-menu__trigger"
        onClick={() => setOpen((value) => !value)}
        ref={triggerRef}
        type="button"
      >
        {trigger ?? (
          <svg aria-hidden="true" focusable="false" height="16" viewBox="0 0 16 16" width="16">
            <circle cx="3" cy="8" fill="currentColor" r="1.4" />
            <circle cx="8" cy="8" fill="currentColor" r="1.4" />
            <circle cx="13" cy="8" fill="currentColor" r="1.4" />
          </svg>
        )}
      </button>
      {open ? (
        <div className="fds-menu__list" id={menuId} role="menu">
          {items.map((item) => (
            <button
              className={cn("fds-menu__item", item.tone === "danger" && "fds-menu__item--danger")}
              disabled={item.disabled}
              key={item.label}
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
                item.onSelect();
              }}
              role="menuitem"
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
