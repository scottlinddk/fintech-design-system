import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type DialogHTMLAttributes,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type Ref,
  type RefObject,
} from "react";
import { cn } from "../lib/cn.js";

export type DialogPlacement = "center" | "bottom" | "start" | "end";

export interface DialogProps extends Omit<
  DialogHTMLAttributes<HTMLDialogElement>,
  "open" | "title" | "onClose" | "onCancel"
> {
  /** Controlled. The app owns the state; every dismissal calls `onOpenChange(false)`. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Required: it names the dialog (`aria-labelledby`). */
  title: ReactNode;
  description?: ReactNode;
  /** Action row, typically `Button`s. */
  footer?: ReactNode;
  /** `center` modal, or a `bottom` / `start` / `end` edge sheet. Defaults to `center`. */
  placement?: DialogPlacement;
  /** Escape and a press on the backdrop close it. Defaults to true. Escape is always honoured by `AlertDialog`. */
  dismissible?: boolean;
  /** Label of the built-in close button. */
  closeLabel?: string;
  /** Hide the built-in close button (keep another visible way to close). */
  hideClose?: boolean;
  /** Element to focus on open instead of the first focusable one. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Overrides `dismissible` for presses on the backdrop only. */
  closeOnBackdrop?: boolean;
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) (ref as { current: T | null }).current = value;
}

/** Longest transition on the dialog, in ms. 0 under reduced motion or when unsupported. */
function exitDuration(element: HTMLElement): number {
  const style = getComputedStyle(element);
  const parse = (value: string) =>
    Math.max(0, ...value.split(",").map((part) => (parseFloat(part) || 0) * 1000));
  return parse(style.transitionDuration) + parse(style.transitionDelay);
}

/**
 * Modal dialog on the native `<dialog>` element: the browser provides modality, inert background,
 * top-layer stacking (so it escapes `overflow` and `z-index` of ancestors) and nested dialogs. The
 * package adds the controlled API, focus restore, backdrop dismissal and the exit animation.
 *
 * Children are mounted only while open or animating out. Scroll lock is CSS-only (`:root:has()`),
 * so nested dialogs need no counter.
 */
export const Dialog = forwardRef<HTMLDialogElement, DialogProps>(function Dialog(
  {
    open,
    onOpenChange,
    title,
    description,
    footer,
    placement = "center",
    dismissible = true,
    closeOnBackdrop,
    closeLabel = "Close",
    hideClose = false,
    initialFocusRef,
    className,
    children,
    onClick,
    onPointerDown,
    role,
    ...props
  },
  forwardedRef,
) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(open);
  // Mount in the same render as `open` so the dialog exists when the layout effect runs.
  const present = open || mounted;
  if (open && !mounted) setMounted(true);

  const setRefs = useCallback(
    (node: HTMLDialogElement | null) => {
      dialogRef.current = node;
      assignRef(forwardedRef, node);
    },
    [forwardedRef],
  );

  // Latest callbacks without re-subscribing the native listeners.
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;
  const dismissibleRef = useRef(dismissible);
  dismissibleRef.current = dismissible;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (dialog.open) return;
      const active = document.activeElement;
      returnFocusRef.current =
        active instanceof HTMLElement && active !== document.body ? active : null;
      dialog.showModal();
      initialFocusRef?.current?.focus();
      return;
    }
    // Also reached after a native close we did not start (form[method=dialog]).
    if (dialog.open) dialog.close();
    const restore = () => {
      const target = returnFocusRef.current;
      returnFocusRef.current = null;
      if (target?.isConnected) target.focus();
    };
    restore();
    const ms = exitDuration(dialog);
    if (ms <= 0) {
      setMounted(false);
      return;
    }
    const timer = setTimeout(() => setMounted(false), ms + 50);
    return () => clearTimeout(timer);
  }, [open, initialFocusRef, present]);

  // Escape fires `cancel`; keep React state the single source of truth.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onCancel = (event: Event) => {
      event.preventDefault();
      if (dismissibleRef.current || dialog.getAttribute("role") === "alertdialog")
        onOpenChangeRef.current(false);
    };
    // A native close we did not ask for (form[method=dialog], devtools) must reach the app too.
    const onClose = () => {
      if (dialog.hasAttribute("data-fds-closing")) return;
      onOpenChangeRef.current(false);
    };
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("close", onClose);
    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("close", onClose);
    };
  }, [present]);

  const pressStartedOnBackdrop = useRef(false);
  const handlePointerDown = (event: PointerEvent<HTMLDialogElement>) => {
    onPointerDown?.(event);
    pressStartedOnBackdrop.current = event.target === event.currentTarget;
  };
  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    onClick?.(event);
    // The padding-free <dialog> is only the event target for presses on its ::backdrop. Requiring the
    // press to start there too stops a text selection that ends on the backdrop from closing it.
    const started = pressStartedOnBackdrop.current;
    pressStartedOnBackdrop.current = false;
    if (started && event.target === event.currentTarget && (closeOnBackdrop ?? dismissible))
      onOpenChange(false);
  };

  if (!present) return null;

  return (
    <dialog
      {...props}
      aria-describedby={description ? descriptionId : props["aria-describedby"]}
      aria-labelledby={titleId}
      className={cn("fds-dialog", `fds-dialog--${placement}`, className)}
      data-fds-closing={open ? undefined : ""}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      ref={setRefs}
      role={role}
    >
      <div className="fds-dialog__surface">
        <div className="fds-dialog__header">
          <h2 className="fds-dialog__title" id={titleId}>
            {title}
          </h2>
          {hideClose ? null : (
            <button
              aria-label={closeLabel}
              className="fds-button fds-button--ghost fds-dialog__close"
              onClick={() => onOpenChange(false)}
              type="button"
            >
              <span aria-hidden="true">×</span>
            </button>
          )}
        </div>
        {description ? (
          <p className="fds-dialog__description" id={descriptionId}>
            {description}
          </p>
        ) : null}
        {children ? <div className="fds-dialog__body">{children}</div> : null}
        {footer ? <div className="fds-dialog__footer">{footer}</div> : null}
      </div>
    </dialog>
  );
});

export type SheetProps = Omit<DialogProps, "placement"> & {
  /** Edge it slides from. Defaults to `bottom` (mobile action sheet); `end` is a side panel. */
  placement?: Exclude<DialogPlacement, "center">;
};

/** Edge-anchored `Dialog`: bottom sheet (safe-area aware) or side panel. Do not confuse with a document layout. */
export const Sheet = forwardRef<HTMLDialogElement, SheetProps>(function Sheet(
  { placement = "bottom", ...props },
  ref,
) {
  return <Dialog {...props} placement={placement} ref={ref} />;
});

export interface AlertDialogProps extends Omit<
  DialogProps,
  "placement" | "footer" | "children" | "dismissible" | "closeOnBackdrop" | "hideClose" | "role"
> {
  confirmLabel: string;
  cancelLabel?: string;
  /** Runs on confirm. The app closes the dialog (`onOpenChange(false)`) when the work is done. */
  onConfirm: () => void;
  /** `danger` styles the confirm button as destructive. Defaults to `default`. */
  tone?: "default" | "danger";
  confirmDisabled?: boolean;
  /** Extra content between the description and the buttons, e.g. a "type to confirm" field. */
  children?: ReactNode;
}

/**
 * Confirmation for irreversible actions. `role="alertdialog"`. Initial focus goes to Cancel, never to
 * a destructive confirm. A press on the backdrop does not dismiss; Escape cancels. The title should
 * state the consequence using app-supplied text.
 */
export const AlertDialog = forwardRef<HTMLDialogElement, AlertDialogProps>(function AlertDialog(
  {
    confirmLabel,
    cancelLabel = "Cancel",
    onConfirm,
    onOpenChange,
    tone = "default",
    confirmDisabled,
    initialFocusRef,
    children,
    ...props
  },
  ref,
) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  return (
    <Dialog
      {...props}
      closeOnBackdrop={false}
      footer={
        <>
          <button
            className="fds-button fds-button--secondary"
            onClick={() => onOpenChange(false)}
            ref={cancelRef}
            type="button"
          >
            {cancelLabel}
          </button>
          <button
            className={cn(
              "fds-button",
              tone === "danger" ? "fds-button--danger" : "fds-button--primary",
            )}
            disabled={confirmDisabled}
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel}
          </button>
        </>
      }
      hideClose
      initialFocusRef={initialFocusRef ?? cancelRef}
      onOpenChange={onOpenChange}
      ref={ref}
      role="alertdialog"
    >
      {children}
    </Dialog>
  );
});
