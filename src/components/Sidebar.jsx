import { useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard,
  StickyNote,
  Settings,
  Moon,
  Sun,
  X,
} from "lucide-react";
import styles from "./Sidebar.module.css";
import useTheme from "./context/useTheme";

const links = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Posts", icon: StickyNote, path: "/posts" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar({ className, drawerOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const handleNav = (path) => {
    navigate(path);
    onClose?.();
  };

  return (
    <aside
      className={`${styles.sidebar} ${drawerOpen ? styles.open : ""} ${className ?? ""}`}
    >
      {/* Brand */}
      <div className={styles.brand}>
        <span className={styles.brandIcon}>✦</span>
        <span className={styles.brandName}>Blog.author</span>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {links.map(({ name, icon: Icon, path }) => {
          const active = location.pathname === path;
          return (
            <button
              key={name}
              type="button"
              onClick={() => handleNav(path)}
              className={`${styles.navBtn} ${active ? styles.active : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={18} className={styles.navIcon} />
              <span>{name}</span>
              {active && <span className={styles.activePill} aria-hidden />}
            </button>
          );
        })}
      </nav>

      {/* Bottom controls */}
      <div className={styles.bottom}>
        <button
          type="button"
          onClick={toggleTheme}
          className={styles.themeBtn}
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
        </button>
      </div>
    </aside>
  );
}
