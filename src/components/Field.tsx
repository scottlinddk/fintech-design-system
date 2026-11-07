import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "../lib/cn.js";

export interface FieldControlProps {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
}

export interface FieldProps {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string;
  /** Render prop so the control receives the generated id and aria wiring. */
  children: (control: FieldControlProps) => ReactNode;
}

/** Label + hint + error wrapper that wires `id`, `aria-describedby` and `aria-invalid`. */
export function Field({ label, hint, error, className, children }: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ");
  const control: FieldControlProps = { id };
  if (describedBy) control["aria-describedby"] = describedBy;
  if (error) control["aria-invalid"] = true;
  return (
    <div className={cn("fds-field", className)}>
      <label className="fds-field__label" htmlFor={id}>
        {label}
      </label>
      {children(control)}
      {hint ? (
        <p className="fds-field__hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="fds-field__error" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("fds-control", className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn("fds-control", className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("fds-control fds-control--multiline", className)} {...props} />;
}
