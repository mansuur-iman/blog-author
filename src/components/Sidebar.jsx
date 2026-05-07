import { useNavigate } from "react-router";
import { LayoutDashboard, StickyNote, Moon, Sun, Settings } from "lucide-react";
import styles from "./Sidebar.module.css";
import { useLocation } from "react-router";
import useTheme from "./context/useTheme";
export default function Sidebar({ className }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { theme, toggleTheme } = useTheme();

  const links = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard />,
      path: "/",
    },
    {
      name: "Posts",
      icon: <StickyNote />,
      path: "/posts",
    },

    {
      name: "Settings",
      icon: <Settings />,
      path: "/settings",
    },
  ];
  return (
    <div className={className}>
      {links.map((link) => (
        <button
          key={link.name}
          type="button"
          onClick={() => navigate(link.path)}
          className={location.pathname === link.path ? styles.active : ""}
        >
          {link.icon}
          {link.name}
        </button>
      ))}

      <button type="button" onClick={toggleTheme}>
        {theme === "light" ? <Moon /> : <Sun />}
      </button>
    </div>
  );
}
