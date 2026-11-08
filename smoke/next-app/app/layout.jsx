import "@scttlnd/fintech-design-system/styles.css";
import "@scttlnd/fintech-design-system/themes/portare.css";

export const metadata = { title: "FDS App Router smoke" };
export default function Layout({ children }) {
  return (
    <html lang="en" data-fds-theme="portare">
      <body>{children}</body>
    </html>
  );
}
