import { useState } from "react";
import {
  Badge,
  Button,
  DistributionList,
  EmptyState,
  Field,
  Input,
  KeyValue,
  Menu,
  Meter,
  Metric,
  Notice,
  Panel,
  SegmentedMeter,
  Select,
  Textarea,
} from "../src/index.js";

export function Showcase({ theme = "funder" }: { theme?: string }) {
  const [message, setMessage] = useState("Choose an action to try the real components.");
  return (
    <main className="showcase">
      <header className="showcase__header">
        <div>
          <p className="fds-eyebrow">Funder · Investor · Portare</p>
          <h1>Fintech Design System</h1>
        </div>
        <form>
          <label htmlFor="theme">Theme</label>{" "}
          <Select
            id="theme"
            name="theme"
            defaultValue={theme}
            onChange={(event) => {
              location.search = `?theme=${event.target.value}`;
            }}
          >
            <option value="funder">Funder</option>
            <option value="investor">Investor</option>
            <option value="portare">Portare (proposed light)</option>
          </Select>
        </form>
      </header>
      <p>Published primitives and styles. Example figures are pre-formatted display strings.</p>
      <Panel
        title="Metrics and detail"
        eyebrow="Display primitives"
        help="Values are supplied by the app."
      >
        <div className="showcase__grid">
          <Metric label="Balance" value="DKK 284,920" />
          <Metric label="Change" value="+4.82 %" tone="success" />
          <KeyValue label="Account" value="Everyday account" />
        </div>
      </Panel>
      <Panel
        title="Buttons, badges and menu"
        action={
          <Menu
            ariaLabel="Example actions"
            items={[
              { label: "View details", onSelect: () => setMessage("View details selected.") },
              { label: "Unavailable", disabled: true, onSelect: () => {} },
              {
                label: "Remove example",
                tone: "danger",
                onSelect: () => setMessage("Remove example selected."),
              },
            ]}
          />
        }
      >
        <div className="showcase__row">
          <Button onClick={() => setMessage("Primary action selected.")}>Primary action</Button>
          <Button variant="secondary" onClick={() => setMessage("Secondary action selected.")}>
            Secondary
          </Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="showcase__row">
          <Badge>Neutral</Badge>
          <Badge tone="accent">Information</Badge>
          <Badge tone="success">Completed</Badge>
          <Badge tone="warn">Review</Badge>
          <Badge tone="danger">Failed</Badge>
        </div>
        <p role="status">{message}</p>
      </Panel>
      <Panel title="Fields and native controls">
        <form className="showcase__grid" onSubmit={(event) => event.preventDefault()}>
          <Field label="Account name" hint="Choose a recognizable label.">
            {(control) => <Input {...control} placeholder="Everyday" />}
          </Field>
          <Field label="Account type">
            {(control) => (
              <Select {...control}>
                <option>Personal</option>
                <option>Shared</option>
              </Select>
            )}
          </Field>
          <Field label="Reference" hint="Required for this example." error="Enter a reference.">
            {(control) => <Input {...control} required />}
          </Field>
          <Field label="Notes">{(control) => <Textarea {...control} />}</Field>
        </form>
      </Panel>
      <Panel title="Notices and empty state">
        <div className="showcase__stack">
          <Notice title="Information">Check the details before continuing.</Notice>
          <Notice tone="success" title="Saved">
            Your preferences were saved.
          </Notice>
          <Notice tone="warn" title="Review required">
            Some details need attention.
          </Notice>
          <Notice tone="danger" title="Could not save">
            Try again after reviewing the form.
          </Notice>
          <EmptyState
            title="No saved views"
            description="Save a view to find it here."
            action={<Button variant="secondary">Create view</Button>}
          />
        </div>
      </Panel>
      <Panel title="Meters and distribution">
        <div className="showcase__stack">
          <Meter label="Profile completeness" value={72} valueText="72 of 100" />
          <SegmentedMeter label="Example level" value={3} valueText="3 of 7" />
          <DistributionList
            items={[
              { label: "Category A", value: 60 },
              { label: "Category B", value: 40 },
            ]}
            formatValue={(value) => (value === 60 ? "60 %" : "40 %")}
          />
        </div>
      </Panel>
    </main>
  );
}
