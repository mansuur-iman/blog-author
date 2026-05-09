import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import { Outlet } from "react-router";
import Footer from "./Footer.jsx";
import ToolBar from "./ToolBar.jsx";
import styles from "./Layout.module.css";

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <ToolBar
        className={styles.toolbar}
        onMenuToggle={() => setDrawerOpen((o) => !o)}
      />

      {/* Mobile overlay */}
      {drawerOpen && (
        <div
          className={styles.overlay}
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar
        className={styles.sidebar}
        drawerOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <main className={styles.main}>
        <Outlet />
      </main>

      <Footer className={styles.footer} />
    </div>
  );
}
