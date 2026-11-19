import "@scttlnd/ui/styles.css";

export const metadata = { title: "FDS App Router smoke" };
export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
