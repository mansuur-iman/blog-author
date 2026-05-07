import { useAuth } from "./context/useAuth";
import { User, LogOut, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import styles from "./ToolBar.module.css";

export default function ToolBar({ className }) {
  const { user, logout } = useAuth(); // Assuming you have a logout function in context
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={`${className} ${styles.toolbar}`}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className={styles.greeting}>Hello, {user.username}</h2>
          <span className={styles.roleBadge}>{user.role}</span>
        </div>
      </div>

      <div className={styles.actions}>
        {user.role === "AUTHOR" && (
          <button
            onClick={() => navigate("/posts/new")}
            className={styles.createBtn}
          >
            <Plus size={18} /> New Post
          </button>
        )}

        <button
          onClick={handleLogout}
          className={styles.logoutBtn}
          title="Sign Out"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
}
