import { useId, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn.js";

export interface PanelProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: ReactNode;
  eyebrow?: ReactNode;
  help?: ReactNode;
  /** Optional trailing action area (buttons, menu). */
  action?: ReactNode;
  /** Heading element for the title. Defaults to h2; pick the level that fits the page outline. */
  headingLevel?: 2 | 3 | 4;
}

/** Titled surface with optional eyebrow, help text and action. Renders a labelled `<section>`. */
export function Panel({
  title,
  eyebrow,
  help,
  action,
  headingLevel = 2,
  className,
  children,
  ...props
}: PanelProps) {
  const headingId = useId();
  const Heading = `h${headingLevel}` as ElementType;
  return (
    <section aria-labelledby={headingId} className={cn("fds-panel", className)} {...props}>
      <header className="fds-panel__header">
        <div className="fds-panel__heading">
          {eyebrow ? <p className="fds-eyebrow">{eyebrow}</p> : null}
          <Heading id={headingId} className="fds-panel__title">
            {title}
          </Heading>
          {help ? <p className="fds-panel__help">{help}</p> : null}
        </div>
        {action ? <div className="fds-panel__action">{action}</div> : null}
      </header>
      {children}
    </section>
  );
}
