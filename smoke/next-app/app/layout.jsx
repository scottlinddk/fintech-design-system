import "@scttlnd/fintech-design-system/styles.css";

export const metadata = { title: "FDS App Router smoke" };
export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
