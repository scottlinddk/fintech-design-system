import { createRoot } from "react-dom/client";
import { Showcase } from "./Showcase.js";
import funder from "../styles/themes/funder.css?url";
import investor from "../styles/themes/investor.css?url";
import portare from "../styles/themes/portare.css?url";
import "./showcase.css";

const themes = { funder, investor, portare };
const requested = new URLSearchParams(location.search).get("theme");
const theme = requested && requested in themes ? (requested as keyof typeof themes) : "funder";
(document.getElementById("fds-theme") as HTMLLinkElement).href = themes[theme];
document.documentElement.dataset.fdsTheme = theme;
createRoot(document.getElementById("root")!).render(<Showcase theme={theme} />);
