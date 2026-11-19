import { createRoot } from "react-dom/client";
import { Showcase } from "./Showcase.js";
import classic from "../styles/themes/classic.css?url";
import funder from "../styles/themes/funder.css?url";
import investor from "../styles/themes/investor.css?url";
import portare from "../styles/themes/portare.css?url";
import studio from "../styles/themes/studio.css?url";
import "../styles/index.css";
import "./showcase.css";

const themes = { studio, classic, funder, investor, portare };
const requested = new URLSearchParams(location.search).get("theme");
const theme =
  requested && Object.hasOwn(themes, requested) ? (requested as keyof typeof themes) : "studio";
const mode = new URLSearchParams(location.search).get("mode") === "dark" ? "dark" : "light";
const themeLink = document.getElementById("fds-theme") as HTMLLinkElement;
themeLink.href = themes[theme];
// Vite emits base CSS at the end of head. Keep the single theme after it.
document.head.append(themeLink);
document.documentElement.dataset.fdsTheme = theme;
document.documentElement.dataset.fdsMode = mode;
createRoot(document.getElementById("root")!).render(<Showcase theme={theme} initialMode={mode} />);
