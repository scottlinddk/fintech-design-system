// @vitest-environment happy-dom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import * as matchers from "vitest-axe/matchers";
import "vitest-axe/extend-expect";
import { Button, Field, Input, Menu, Select, Textarea } from "../index.js";

expect.extend(matchers);
afterEach(cleanup);

describe("Button interaction and accessibility", () => {
  it("activates with Enter and Space, and defaults to a non-submit button", async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    const submit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={submit}>
        <Button onClick={click}>Save</Button>
      </form>,
    );
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Save" }));
    await user.keyboard("{Enter} ");
    expect(click).toHaveBeenCalledTimes(2);
    expect(submit).not.toHaveBeenCalled();
  });
  it("preserves explicit submit behaviour and skips disabled buttons", async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    const submit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={submit}>
        <Button disabled onClick={click}>
          Disabled
        </Button>
        <Button type="submit">Submit</Button>
      </form>,
    );
    await user.click(screen.getByRole("button", { name: "Disabled" }));
    expect(click).not.toHaveBeenCalled();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Submit" }));
    await user.keyboard("{Enter}");
    expect(submit).toHaveBeenCalledOnce();
  });
  it("has no axe violations in its current variants", async () => {
    const { container } = render(
      <div>
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button disabled>Disabled</Button>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Field interaction and accessibility", () => {
  it("connects label, hint and error, accepts typing and removes stale error wiring", async () => {
    const user = userEvent.setup();
    const example = (error?: string) => (
      <Field label="Account name" hint="Use a recognizable name." error={error}>
        {(control) => <Input {...control} />}
      </Field>
    );
    const { rerender, container } = render(example("Required"));
    const input = screen.getByRole("textbox", { name: "Account name" }) as HTMLInputElement;
    await user.click(screen.getByText("Account name"));
    expect(document.activeElement).toBe(input);
    await user.type(input, "Everyday");
    expect(input.value).toBe("Everyday");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    const descriptions = input
      .getAttribute("aria-describedby")!
      .split(" ")
      .map((id) => document.getElementById(id)?.textContent);
    expect(descriptions).toEqual(["Use a recognizable name.", "Required"]);
    expect(await axe(container)).toHaveNoViolations();
    rerender(example());
    expect(input.hasAttribute("aria-invalid")).toBe(false);
    expect(input.getAttribute("aria-describedby")?.split(" ")).toHaveLength(1);
    expect(screen.queryByText("Required")).toBeNull();
    expect(await axe(container)).toHaveNoViolations();
  });
  it("generates unique labels for native select and textarea controls", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <div>
        <Field label="Type">
          {(control) => (
            <Select {...control}>
              <option>Personal</option>
              <option>Shared</option>
            </Select>
          )}
        </Field>
        <Field label="Notes">{(control) => <Textarea {...control} />}</Field>
      </div>,
    );
    const select = screen.getByRole("combobox", { name: "Type" }) as HTMLSelectElement;
    const textarea = screen.getByRole("textbox", { name: "Notes" }) as HTMLTextAreaElement;
    expect(select.id).not.toBe(textarea.id);
    await user.selectOptions(select, "Shared");
    expect(select.value).toBe("Shared");
    await user.type(textarea, "Remember this");
    expect(textarea.value).toBe("Remember this");
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Menu interaction and accessibility", () => {
  const example = (onSelect = vi.fn()) => (
    <>
      <Menu
        ariaLabel="Actions"
        items={[
          { label: "First", onSelect },
          { label: "Disabled", disabled: true, onSelect },
          { label: "Last", tone: "danger", onSelect },
        ]}
      />
      <Button>Outside</Button>
    </>
  );
  it("opens from the keyboard, skips disabled items, wraps, and restores focus on Escape", async () => {
    const user = userEvent.setup();
    const { container } = render(example());
    const trigger = screen.getByRole("button", { name: "Actions" });
    expect(await axe(container)).toHaveNoViolations();
    await user.tab();
    await user.keyboard("{Enter}");
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "First" }));
    expect(trigger.getAttribute("aria-controls")).toBe(screen.getByRole("menu").id);
    expect(await axe(container)).toHaveNoViolations();
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Last" }));
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "First" }));
    await user.keyboard("{ArrowUp}");
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Last" }));
    await user.keyboard("{Home}");
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "First" }));
    await user.keyboard("{End}");
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Last" }));
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
  it("activates one item, closes, and returns focus", async () => {
    const user = userEvent.setup();
    const select = vi.fn();
    render(example(select));
    const trigger = screen.getByRole("button", { name: "Actions" });
    await user.click(trigger);
    await user.click(screen.getByRole("menuitem", { name: "Disabled" }));
    expect(select).not.toHaveBeenCalled();
    await user.click(screen.getByRole("menuitem", { name: "First" }));
    expect(select).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(trigger);
    await user.keyboard("{Enter}{Enter}");
    expect(select).toHaveBeenCalledTimes(2);
    expect(document.activeElement).toBe(trigger);
  });
  it("dismisses on outside press and Tab", async () => {
    const user = userEvent.setup();
    render(example());
    const trigger = screen.getByRole("button", { name: "Actions" });
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByRole("menu")).toBeNull();
    await user.click(trigger);
    await user.tab();
    expect(screen.queryByRole("menu")).toBeNull();
  });
  it("handles empty and all-disabled menus without selecting an item", async () => {
    const user = userEvent.setup();
    const select = vi.fn();
    const { rerender } = render(<Menu ariaLabel="Actions" items={[]} />);
    await user.click(screen.getByRole("button", { name: "Actions" }));
    await user.keyboard("{ArrowDown}{Escape}");
    rerender(
      <Menu
        ariaLabel="Actions"
        items={[{ label: "Disabled", disabled: true, onSelect: select }]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Actions" }));
    await user.keyboard("{Home}{End}{Escape}");
    expect(select).not.toHaveBeenCalled();
    expect(screen.queryByRole("menu")).toBeNull();
  });
});
