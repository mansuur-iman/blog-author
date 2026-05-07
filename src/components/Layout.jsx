import Sidebar from "./Sidebar.jsx";
import { Outlet } from "react-router";
import Footer from "./Footer.jsx";
import ToolBar from "./ToolBar.jsx";
import styles from "./Layout.module.css";

export default function Layout() {
  return (
    <div className={styles.layout}>
      <ToolBar className={styles.toolbar} />
      <Sidebar className={styles.sidebar} />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer className={styles.footer} />
    </div>
  );
}
