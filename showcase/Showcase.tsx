import { useState, type ReactNode } from "react";
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

const repository = "https://github.com/scottlinddk/ui";
const installCommand = "npm install @scttlnd/ui";
const previewTabs = ["Overview", "Activity", "Settings"] as const;
type PreviewTab = (typeof previewTabs)[number];

function Icon({
  name,
  size = 18,
}: {
  name: "arrow" | "copy" | "check" | "sun" | "moon" | "code" | "grid" | "layers";
  size?: number;
}) {
  const paths = {
    arrow: "M7 17 17 7M7 7h10v10",
    copy: "M9 9h11v11H9zM15 5V3H3v12h2",
    check: "m5 12 4 4L19 6",
    sun: "M12 3V1m0 22v-2M3 12H1m22 0h-2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
    moon: "M21 13a9 9 0 0 1-10-10A9 9 0 1 0 21 13Z",
    code: "m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16",
    grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
    layers: "m12 3 10 5-10 5L2 8l10-5ZM2 12l10 5 10-5M2 16l10 5 10-5",
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}

function SectionHeading({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="section-number">{number} / THE SYSTEM</span>
        <h2>{title}</h2>
      </div>
      <p>{children}</p>
    </div>
  );
}

export function Showcase({
  theme = "studio",
  initialMode = "light",
}: {
  theme?: string;
  initialMode?: "light" | "dark";
}) {
  const [message, setMessage] = useState("Choose an action to try the real components.");
  const [copyState, setCopyState] = useState("Copy command");
  const [mode, setMode] = useState(initialMode);
  const [preview, setPreview] = useState<PreviewTab>("Overview");
  const [savedView, setSavedView] = useState(false);
  const [preferencesSaved, setPreferencesSaved] = useState(false);

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopyState("Copied!");
    } catch {
      setCopyState("Select and copy the command below.");
    }
  }

  function toggleMode() {
    const next = mode === "light" ? "dark" : "light";
    setMode(next);
    document.documentElement.dataset.fdsMode = next;
    const url = new URL(location.href);
    url.searchParams.set("mode", next);
    history.replaceState(null, "", url);
  }

  return (
    <div
      className={`site-shell${theme === "studio" ? " site-shell--studio" : ""}${theme === "classic" ? " site-shell--classic" : ""}${theme === "nuance" ? " site-shell--nuance" : ""}`}
      data-fds-grain={
        theme === "studio" || theme === "classic" || theme === "nuance" ? "off" : undefined
      }
    >
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a className="wordmark" href="#">
          <span className="brand-symbol" aria-hidden="true">
            s<span>+</span>
          </span>
          <span>
            scttlnd<span className="wordmark__suffix">/ui</span>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#components">Components</a>
          <a href="#foundations">Foundations</a>
          <a href="#get-started">Get started</a>
        </nav>
        <div className="site-header__tools">
          <label className="sr-only" htmlFor="theme">
            Theme
          </label>
          <Select
            id="theme"
            name="theme"
            value={theme}
            onChange={(event) => {
              const url = new URL(location.href);
              url.searchParams.set("theme", event.target.value);
              location.href = url.href;
            }}
          >
            <option value="studio">Studio</option>
            <option value="classic">Classic</option>
            <option value="nuance">Nuance</option>
            <option value="funder">Funder</option>
            <option value="investor">Investor</option>
            <option value="portare">Portare (proposed light)</option>
          </Select>
          {theme === "studio" || theme === "classic" || theme === "nuance" ? (
            <Button
              variant="ghost"
              className="icon-button"
              aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
              onClick={toggleMode}
            >
              <Icon name={mode === "light" ? "moon" : "sun"} />
            </Button>
          ) : null}
          <a className="github-link" href={repository} aria-label="View source on GitHub">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.64-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.6 9.6 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
            </svg>
          </a>
        </div>
      </header>
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__copy">
            <a className="release-label" href={`${repository}/releases`}>
              <span className="status-dot" />
              Shared foundations. Independent products.
              <Icon name="arrow" size={13} />
            </a>
            <h1 id="hero-title">
              Scttlnd
              <br />
              <span>UI</span>
            </h1>
            <p className="hero__description">
              A little less noise. A lot more clarity.
              <br />
              One considered foundation for every financial interface.
            </p>
            <div className="hero__actions">
              <a className="action-link action-link--primary" href="#components">
                Explore components <Icon name="arrow" size={16} />
              </a>
              <a className="action-link" href="#get-started">
                <Icon name="code" size={17} /> Start building
              </a>
            </div>
            <div className="hero__meta">
              <span>React + TypeScript</span>
              <span aria-hidden="true">/</span>
              <span>Accessible by default</span>
              <span aria-hidden="true">/</span>
              <span>Open source</span>
            </div>
          </div>
          {theme === "studio" ? (
            <div className="hero-materials" aria-hidden="true">
              <div className="material-card material-card--back">
                <Icon name="layers" size={24} />
                <span>ONE CONNECTED FOUNDATION</span>
                <div className="material-card__lines">
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </div>
              <div className="material-card material-card--front">
                <div className="material-card__top">
                  <span>scttlnd/ui</span>
                  <Icon name="arrow" size={17} />
                </div>
                <p>
                  Clear by design.
                  <br />
                  Built to connect.
                </p>
                <div className="material-card__bottom">
                  <span>FUNDER / INVESTOR / PORTARE</span>
                  <span className="material-card__mark">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
              </div>
              <div className="material-note">
                <Icon name="check" size={16} />
                <div>
                  <strong>Ready to build.</strong>
                  <small>Accessible. Composable.</small>
                </div>
              </div>
              <span className="material-caption">A system that feels like a whole.</span>
            </div>
          ) : null}
        </section>

        <section className="preview-stage" aria-label="Interactive component preview">
          <div className="preview-window">
            <header className="preview-toolbar">
              <div className="preview-toolbar__label">
                <span className="window-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span>your next financial interface</span>
              </div>
              <span className="preview-live">
                <span className="status-dot" /> Live preview
              </span>
            </header>
            <div className="preview-content">
              <div className="preview-heading">
                <div>
                  <p className="overline">WORKSPACE / PERSONAL</p>
                  <h2>Good things, in balance.</h2>
                  <p>A clear view of what matters.</p>
                </div>
                <Badge tone="success">All systems ready</Badge>
              </div>
              <div className="preview-tabs" role="tablist" aria-label="Preview sections">
                {previewTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    id={`tab-${tab}`}
                    aria-selected={preview === tab}
                    aria-controls="preview-panel"
                    tabIndex={preview === tab ? 0 : -1}
                    onClick={() => setPreview(tab)}
                    onKeyDown={(event) => {
                      const index = previewTabs.indexOf(tab);
                      let next: number | undefined;
                      if (event.key === "ArrowRight") next = (index + 1) % previewTabs.length;
                      if (event.key === "ArrowLeft")
                        next = (index + previewTabs.length - 1) % previewTabs.length;
                      if (event.key === "Home") next = 0;
                      if (event.key === "End") next = previewTabs.length - 1;
                      if (next !== undefined) {
                        event.preventDefault();
                        setPreview(previewTabs[next]);
                        document.getElementById(`tab-${previewTabs[next]}`)?.focus();
                      }
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div
                id="preview-panel"
                role="tabpanel"
                aria-labelledby={`tab-${preview}`}
                className="preview-panel"
                tabIndex={0}
              >
                {preview === "Overview" ? (
                  <>
                    <div className="preview-metrics">
                      <Metric label="Total balance" value="DKK 284,920" />
                      <Metric label="Monthly change" value="+4.82 %" tone="success" />
                      <Metric label="Available to invest" value="DKK 42,500" />
                    </div>
                    <div className="preview-bottom">
                      <div>
                        <span className="overline">EVERYDAY ACCOUNT</span>
                        <p>Everything in its right place.</p>
                      </div>
                      <div className="preview-bottom__detail">
                        <span className="status-dot" /> Updated just now
                      </div>
                    </div>
                  </>
                ) : null}
                {preview === "Activity" ? (
                  <div className="activity-list">
                    {[
                      {
                        label: "Monthly statement",
                        detail: "November · Ready to view",
                        status: "Available",
                      },
                      {
                        label: "Account preferences",
                        detail: "Your changes have been saved",
                        status: "Completed",
                      },
                      {
                        label: "Profile verification",
                        detail: "A few details need your attention",
                        status: "Review",
                      },
                    ].map((item) => (
                      <div className="activity-row" key={item.label}>
                        <div>
                          <strong>{item.label}</strong>
                          <p>{item.detail}</p>
                        </div>
                        <Badge tone={item.status === "Review" ? "warn" : "success"}>
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : null}
                {preview === "Settings" ? (
                  <form
                    className="preview-settings"
                    onSubmit={(event) => {
                      event.preventDefault();
                      setPreferencesSaved(true);
                    }}
                  >
                    <Field label="Workspace name">
                      {(control) => (
                        <Input
                          {...control}
                          defaultValue="Personal workspace"
                          onChange={() => setPreferencesSaved(false)}
                        />
                      )}
                    </Field>
                    <Field label="Currency">
                      {(control) => (
                        <Select {...control} onChange={() => setPreferencesSaved(false)}>
                          <option>DKK — Danish krone</option>
                          <option>EUR — Euro</option>
                          <option>USD — US dollar</option>
                        </Select>
                      )}
                    </Field>
                    <div>
                      <Button type="submit">Save preferences</Button>
                      <span className="save-status" role="status">
                        {preferencesSaved ? "Preferences saved." : ""}
                      </span>
                    </div>
                  </form>
                ) : null}
              </div>
            </div>
          </div>
          <div className="preview-caption">
            <span>
              <Icon name="layers" size={14} /> Real components. One shared language.
            </span>
            <a href="#components">
              Meet the building blocks <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>
        <div className="product-strip">
          <span>THREE PRODUCTS. ONE FOUNDATION.</span>
          <div>
            <span>
              funder<span className="product-plus">+</span>
            </span>
            <span>
              investor<span className="product-period">.</span>
            </span>
            <span className="product-portare">
              portare <Icon name="arrow" size={22} />
            </span>
          </div>
        </div>

        <section id="components" className="components-section">
          <SectionHeading number="01" title="Small pieces. A complete system.">
            Purposeful primitives that work together. <br />
            Consistent in every product, down to the last pixel.
          </SectionHeading>
          <div className="component-grid">
            <Panel
              title="Actions & feedback"
              eyebrow="01 / INTERACTION"
              help="A clear next step, in every state."
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
                <Button onClick={() => setMessage("Primary action selected.")}>
                  Primary action <span aria-hidden="true">↗</span>
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setMessage("Secondary action selected.")}
                >
                  Secondary
                </Button>
                <Button variant="ghost" onClick={() => setMessage("Ghost action selected.")}>
                  Ghost
                </Button>
                <Button disabled>Disabled</Button>
              </div>
              <p role="status" className="interaction-status">
                {message}
              </p>
              <div className="component-divider" />
              <p className="example-label">A status for every outcome</p>
              <div className="showcase__row">
                <Badge>Neutral</Badge>
                <Badge tone="accent">Information</Badge>
                <Badge tone="success">Completed</Badge>
                <Badge tone="warn">Review</Badge>
                <Badge tone="danger">Failed</Badge>
              </div>
            </Panel>
            <Panel
              title="A place for every detail"
              eyebrow="02 / INPUT"
              help="Familiar controls. Thoughtful defaults."
            >
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
                <Field
                  label="Reference"
                  hint="Required for this example."
                  error="Enter a reference."
                >
                  {(control) => <Input {...control} required placeholder="e.g. Savings account" />}
                </Field>
                <Field label="Notes">
                  {(control) => <Textarea {...control} placeholder="A little context…" />}
                </Field>
              </form>
            </Panel>
            <Panel
              title="Numbers with perspective"
              eyebrow="03 / DATA DISPLAY"
              help="Pre-formatted values. Clearly communicated."
            >
              <div className="showcase__grid">
                <Metric label="Balance" value="DKK 284,920" />
                <Metric label="Change" value="+4.82 %" tone="success" />
              </div>
              <KeyValue label="Account" value="Everyday account" />
              <div className="component-divider" />
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
            <Panel
              title="The right message"
              eyebrow="04 / COMMUNICATION"
              help="Helpful when it matters. Quiet when it doesn't."
            >
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
              </div>
            </Panel>
            <Panel
              className="empty-example"
              title="Room for what's next"
              eyebrow="05 / EMPTY STATES"
              help="Even an empty screen should feel considered."
            >
              {savedView ? (
                <div className="saved-view">
                  <div>
                    <Icon name="grid" />
                    <strong>My first view</strong>
                    <Badge tone="success">Saved</Badge>
                  </div>
                  <Button variant="ghost" onClick={() => setSavedView(false)}>
                    Remove view
                  </Button>
                </div>
              ) : (
                <EmptyState
                  title="No saved views"
                  description="A clear starting point for something useful."
                  action={
                    <Button variant="secondary" onClick={() => setSavedView(true)}>
                      <span aria-hidden="true">+</span> Create view
                    </Button>
                  }
                />
              )}
            </Panel>
          </div>
        </section>

        <section id="foundations" className="foundations-section">
          <SectionHeading number="02" title="Consistency starts underneath.">
            Shared tokens for color, spacing, and typography. <br />
            Change the theme. Keep the system.
          </SectionHeading>
          <div className="foundation-grid">
            <div className="foundation-cell">
              <Icon name="grid" />
              <h3>A restrained palette</h3>
              <p>Neutral surfaces give content space. Semantic colors give every state meaning.</p>
              <div className="swatches">
                {["foreground", "muted", "line", "panel-raised", "background"].map((token) => (
                  <div key={token}>
                    <span className={`swatch swatch--${token}`} />
                    <code>{token === "panel-raised" ? "surface" : token}</code>
                  </div>
                ))}
              </div>
            </div>
            <div className="foundation-cell">
              <Icon name="code" />
              <h3>Type that brings clarity</h3>
              <p>A deliberate hierarchy. Comfortable reading. Tabular figures that stay in line.</p>
              <div className="type-sample">
                Aa<span>0123456789</span>
              </div>
              <div className="foundation-caption">
                SANS FOR CONTENT <span>/</span> MONO FOR DETAIL
              </div>
            </div>
            <div className="foundation-cell">
              <Icon name="layers" />
              <h3>Space with a rhythm</h3>
              <p>
                A shared 4px scale makes every layout feel related, from a field to a full page.
              </p>
              <div className="spacing-sample">
                {[1, 2, 3, 4, 6, 8].map((step) => (
                  <div key={step}>
                    <span
                      style={{
                        width: `var(--fds-space-${step})`,
                        height: `var(--fds-space-${step})`,
                      }}
                    />
                    <code>{step * 4}</code>
                  </div>
                ))}
              </div>
              <div className="foundation-caption">
                ONE SCALE <span>/</span> ENDLESS COMPOSITIONS
              </div>
            </div>
          </div>
        </section>
        <section id="get-started" className="getting-started">
          <div>
            <span className="section-number">03 / MAKE IT YOURS</span>
            <h2>
              Less setup.
              <br />
              More building.
            </h2>
            <p>
              Install the package. Choose your theme.
              <br />
              Let the details take care of themselves.
            </p>
            <a className="text-link" href={`${repository}#use-in-frontend-after-npm-release`}>
              Read the documentation <Icon name="arrow" size={15} />
            </a>
          </div>
          <div className="install-panel">
            <div className="install-panel__header">
              <span>YOUR TERMINAL</span>
              <Button
                variant="ghost"
                className="copy-button"
                aria-label="Copy install command"
                onClick={copyCommand}
              >
                <Icon name={copyState === "Copied!" ? "check" : "copy"} size={15} />
                <span>{copyState === "Copied!" ? "Copied!" : "Copy"}</span>
              </Button>
            </div>
            <pre>
              <span aria-hidden="true">$ </span>
              <code>{installCommand}</code>
            </pre>
            <div className="install-panel__footer">
              <span>npm</span>
              <span>React 18+ · TypeScript ready</span>
            </div>
            <p className="sr-only" role="status">
              {copyState}
            </p>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <a className="wordmark" href="#">
          <span className="brand-symbol" aria-hidden="true">
            s<span>+</span>
          </span>
          <span>Built to feel connected.</span>
        </a>
        <p>Funder · Investor · Portare</p>
        <a href={repository}>
          Open source on GitHub <Icon name="arrow" size={14} />
        </a>
      </footer>
    </div>
  );
}
