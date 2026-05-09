import { useAuth } from "./context/useAuth";
import { LogOut, Plus, Menu } from "lucide-react";
import { useNavigate } from "react-router";
import styles from "./ToolBar.module.css";

export default function ToolBar({ className, onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user.username?.charAt(0).toUpperCase() ?? "?";

  return (
    <header className={`${className ?? ""} ${styles.toolbar}`}>
      <div className={styles.left}>
        {/* Hamburger — mobile only */}
        <button
          type="button"
          className={styles.menuBtn}
          onClick={onMenuToggle}
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>

        <div className={styles.userInfo}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.userText}>
            <span className={styles.greeting}>Hello, {user.username}</span>
            <span className={styles.roleBadge}>{user.role}</span>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        {user.role === "AUTHOR" && (
          <button
            type="button"
            onClick={() => navigate("/posts/new")}
            className={styles.createBtn}
          >
            <Plus size={16} />
            <span>New Post</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className={styles.logoutBtn}
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
