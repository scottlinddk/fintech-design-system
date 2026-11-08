import { createRoot } from "react-dom/client";
import { Badge, Button, Metric, Panel } from "../src/index.js";
import funder from "../styles/themes/funder.css?url";
import investor from "../styles/themes/investor.css?url";
import portare from "../styles/themes/portare.css?url";
import "./showcase.css";

const themes = { funder, investor, portare };
const requested = new URLSearchParams(location.search).get("theme");
const theme = requested && requested in themes ? (requested as keyof typeof themes) : "funder";
const themeLink = document.getElementById("fds-theme") as HTMLLinkElement;
themeLink.href = themes[theme];
document.head.append(themeLink);
document.documentElement.dataset.fdsTheme = theme;

function Grain() {
  return (
    <main className="showcase">
      <section className="fds-grain fds-grain--hero" aria-labelledby="grain-hero">
        <p className="fds-eyebrow">Grain surfaces</p>
        <h1 id="grain-hero">Quiet surfaces with a little texture</h1>
        <p>
          A hairline border, a soft two-colour glow and fine film grain. Opt in per surface with the{" "}
          <code>fds-grain</code> class.
        </p>
        <div className="showcase__row">
          <Button>Primary action</Button>
          <Button variant="secondary">Secondary</Button>
        </div>
      </section>
      <div className="showcase__grid">
        <Panel
          className="fds-grain"
          eyebrow="Default"
          title="Portfolio value"
          help="Pre-formatted."
        >
          <Metric label="Balance" value="DKK 284,920" />
          <p>
            <Badge tone="success">Up</Badge>
          </p>
        </Panel>
        <Panel
          className="fds-grain fds-grain--warm"
          eyebrow="Warm"
          title="Needs attention"
          help="Use sparingly."
        >
          <Metric label="Open items" value="3" tone="warn" />
        </Panel>
        <Panel
          className="fds-grain fds-grain--subtle"
          eyebrow="Subtle"
          title="Quiet variant"
          help="Lower glow and grain."
        >
          <Metric label="Change" value="+4.82 %" tone="success" />
        </Panel>
      </div>
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<Grain />);
