export default function Footer({ className }) {
  return (
    <footer
      className={className}
      style={{
        padding: "16px 20px",
        borderTop: "1px solid var(--border)",
        fontSize: "12px",
        color: "var(--s-text)",
        textAlign: "center",
        letterSpacing: "0.04em",
      }}
    >
      Blog.author © {new Date().getFullYear()}
    </footer>
  );
}
