import { Badge, Button, Panel } from "@scttlnd/fintech-design-system";
import { ClientExample } from "./client-example.jsx";

// Deliberate server-side function invocation: this fails if Badge becomes a client reference.
const serverBadge = () => Badge({ children: "Server-rendered badge", tone: "success" });
export default function Page() {
  return (
    <main>
      <h1>Package App Router smoke</h1>
      {serverBadge()}
      <Button>Server-imported button</Button>
      <Panel title="Server-imported panel">Static children cross the boundary.</Panel>
      <ClientExample />
    </main>
  );
}
