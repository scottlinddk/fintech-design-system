// @vitest-environment happy-dom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import * as matchers from "vitest-axe/matchers";
import "vitest-axe/extend-expect";
import { AlertDialog, Button, Dialog, Sheet } from "../index.js";

expect.extend(matchers);
afterEach(cleanup);

/* happy-dom implements open/close/showModal but not top-layer focus, inertness or Escape. These tests
 * cover the controlled contract, focus restore, dismissal wiring and markup. Native Escape, backdrop,
 * scroll lock and animation are covered by the Chromium run in e2e/. */
const escape = (dialog: HTMLElement) =>
  act(() => {
    dialog.dispatchEvent(new Event("cancel", { cancelable: true }));
  });

function Harness({ dismissible, onChange }: { dismissible?: boolean; onChange?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Dialog
        dismissible={dismissible}
        footer={<Button onClick={() => setOpen(false)}>Done</Button>}
        onOpenChange={(next) => {
          onChange?.();
          setOpen(next);
        }}
        open={open}
        title="Edit holding"
        description="Changes apply to this account."
      >
        <p>Body text</p>
      </Dialog>
    </>
  );
}

describe("Dialog", () => {
  it("renders nothing, and no children, while closed", () => {
    expect(renderToStaticMarkup(<Dialog onOpenChange={() => {}} open={false} title="T" />)).toBe(
      "",
    );
  });
  it("opens as a modal named by its title and described by its description", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    expect(screen.queryByText("Body text")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Open" }));
    const dialog = document.querySelector("dialog") as HTMLDialogElement;
    expect(dialog.open).toBe(true);
    const title = screen.getByRole("heading", { name: "Edit holding" });
    expect(dialog.getAttribute("aria-labelledby")).toBe(title.id);
    const description = screen.getByText("Changes apply to this account.");
    expect(dialog.getAttribute("aria-describedby")).toBe(description.id);
    expect(screen.getByText("Body text")).toBeTruthy();
  });
  it("returns focus to the trigger on close", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(document.querySelector("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
  it("asks the app to close on the close button, and unmounts once the app does", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<Harness onChange={change} />);
    await user.click(screen.getByRole("button", { name: "Open" }));
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(change).toHaveBeenCalledOnce();
    expect(screen.queryByRole("heading", { name: "Edit holding" })).toBeNull();
  });
  it("closes on Escape (cancel) through onOpenChange and never by itself", async () => {
    const onOpenChange = vi.fn();
    render(<Dialog onOpenChange={onOpenChange} open title="T" />);
    const dialog = document.querySelector("dialog") as HTMLDialogElement;
    const cancel = new Event("cancel", { cancelable: true });
    act(() => {
      dialog.dispatchEvent(cancel);
    });
    expect(cancel.defaultPrevented).toBe(true);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(dialog.open).toBe(true);
  });
  it("closes when the backdrop is pressed, but not when a press starts inside and ends on it", async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog onOpenChange={onOpenChange} open title="T">
        <p>Inside</p>
      </Dialog>,
    );
    const dialog = document.querySelector("dialog") as HTMLDialogElement;
    fireEvent.pointerDown(screen.getByText("Inside"));
    fireEvent.click(dialog);
    expect(onOpenChange).not.toHaveBeenCalled();
    fireEvent.pointerDown(dialog);
    fireEvent.click(dialog);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    onOpenChange.mockClear();
    fireEvent.click(screen.getByText("Inside"));
    expect(onOpenChange).not.toHaveBeenCalled();
  });
  it("ignores Escape and backdrop presses when not dismissible", () => {
    const onOpenChange = vi.fn();
    render(<Dialog dismissible={false} onOpenChange={onOpenChange} open title="T" />);
    const dialog = document.querySelector("dialog") as HTMLDialogElement;
    escape(dialog);
    fireEvent.pointerDown(dialog);
    fireEvent.click(dialog);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Close" })).toBeTruthy();
  });
  it("tells the app about a native close it did not start", () => {
    const onOpenChange = vi.fn();
    render(<Dialog onOpenChange={onOpenChange} open title="T" />);
    act(() => (document.querySelector("dialog") as HTMLDialogElement).close());
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
  it("moves initial focus to initialFocusRef", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <Dialog initialFocusRef={ref} onOpenChange={() => {}} open title="T">
        <input aria-label="Amount" ref={ref} />
      </Dialog>,
    );
    expect(document.activeElement).toBe(ref.current);
  });
  it("forwards ref and className and applies the placement class", () => {
    const ref = createRef<HTMLDialogElement>();
    render(<Sheet className="mine" onOpenChange={() => {}} open ref={ref} title="T" />);
    expect(ref.current).toBe(document.querySelector("dialog"));
    expect(ref.current?.className).toBe("fds-dialog fds-dialog--bottom mine");
  });
  it("stacks nested sheets and closes only the one the app closes", async () => {
    function Nested() {
      const [inner, setInner] = useState(true);
      return (
        <Sheet onOpenChange={() => {}} open title="Outer">
          <Sheet onOpenChange={() => setInner(false)} open={inner} placement="end" title="Inner" />
        </Sheet>
      );
    }
    render(<Nested />);
    expect(document.querySelectorAll("dialog[open]")).toHaveLength(2);
    await userEvent.setup().click(screen.getAllByRole("button", { name: "Close" })[1]!);
    expect(screen.queryByRole("heading", { name: "Inner" })).toBeNull();
    expect(screen.getByRole("heading", { name: "Outer" })).toBeTruthy();
  });
  it("has no axe violations open, as a sheet, and as an alert dialog", async () => {
    const { container } = render(
      <>
        <Dialog onOpenChange={() => {}} open title="Edit" description="Desc">
          <p>Body</p>
        </Dialog>
        <Sheet onOpenChange={() => {}} open title="Filters" />
        <AlertDialog
          confirmLabel="Delete"
          onConfirm={() => {}}
          onOpenChange={() => {}}
          open
          title="Delete account?"
          tone="danger"
        />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("AlertDialog", () => {
  it("is an alertdialog and focuses Cancel, never the destructive confirm", () => {
    render(
      <AlertDialog
        confirmLabel="Delete"
        description="This cannot be undone."
        onConfirm={() => {}}
        onOpenChange={() => {}}
        open
        title="Delete 3 holdings?"
        tone="danger"
      />,
    );
    const dialog = document.querySelector("dialog") as HTMLDialogElement;
    expect(dialog.getAttribute("role")).toBe("alertdialog");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByRole("button", { name: "Delete" }).className).toContain(
      "fds-button--danger",
    );
    expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
  });
  it("runs onConfirm without closing, and cancels through onOpenChange", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <AlertDialog
        confirmLabel="Confirm"
        onConfirm={onConfirm}
        onOpenChange={onOpenChange}
        open
        title="Send?"
      />,
    );
    await user.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onOpenChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
  it("is not dismissed by a backdrop press but is by Escape", () => {
    const onOpenChange = vi.fn();
    render(
      <AlertDialog
        confirmLabel="Go"
        onConfirm={() => {}}
        onOpenChange={onOpenChange}
        open
        title="T"
      />,
    );
    const dialog = document.querySelector("dialog") as HTMLDialogElement;
    fireEvent.pointerDown(dialog);
    fireEvent.click(dialog);
    expect(onOpenChange).not.toHaveBeenCalled();
    escape(dialog);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
  it("disables confirm while the app says so", () => {
    render(
      <AlertDialog
        confirmDisabled
        confirmLabel="Delete"
        onConfirm={() => {}}
        onOpenChange={() => {}}
        open
        title="Type DELETE"
      />,
    );
    expect((screen.getByRole("button", { name: "Delete" }) as HTMLButtonElement).disabled).toBe(
      true,
    );
  });
});
