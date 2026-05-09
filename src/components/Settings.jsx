import { useEffect, useState } from "react";
import { useAuth } from "./context/useAuth";
import { getUser } from "../api/post";
import { Navigate } from "react-router";
import styles from "./Settings.module.css";

export default function Settings() {
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { token, user } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUser(token);
        setAuthor(userData);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    if (token && user?.role === "AUTHOR") fetchUser();
  }, [token, user]);

  if (!user || user.role !== "AUTHOR") return <Navigate to="/login" replace />;

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.skeleton}>
          <div className={`${styles.skeletonCircle}`} />
          <div className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
        </div>
        <div className={styles.card}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.fieldGroup}>
              <div
                className={`${styles.skeletonLine} ${styles.skeletonLabel}`}
              />
              <div
                className={`${styles.skeletonLine} ${styles.skeletonValue}`}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <p className={styles.errorFull}>{error}</p>;
  if (!author) return <p className={styles.errorFull}>User not found.</p>;

  const initials =
    [author.first_name, author.last_name]
      .filter(Boolean)
      .map((n) => n.charAt(0).toUpperCase())
      .join("") ||
    author.username?.charAt(0).toUpperCase() ||
    "?";

  const fields = [
    { label: "First Name", value: author.first_name },
    { label: "Last Name", value: author.last_name },
    { label: "Username", value: author.username },
    { label: "Email", value: author.email },
  ];

  return (
    <div className={styles.container}>
      {error && <p className={styles.error}>{error}</p>}

      <header className={styles.header}>
        <div className={styles.avatar}>{initials}</div>
        <div className={styles.headerText}>
          <h1 className={styles.title}>{author.username}</h1>
          <span className={styles.badge}>{author.role}</span>
        </div>
      </header>

      <div className={styles.card}>
        {fields.map(({ label, value }) => (
          <div key={label} className={styles.fieldGroup}>
            <label className={styles.label}>{label}</label>
            <p className={styles.value}>
              {value || <span className={styles.unset}>Not set</span>}
            </p>
          </div>
        ))}

        <div className={styles.divider} />

        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>
              {author.posts?.length ?? 0}
            </span>
            <span className={styles.statLabel}>Total Posts</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>
              {author.posts?.filter((p) => p.published).length ?? 0}
            </span>
            <span className={styles.statLabel}>Published</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>
              {author.posts?.filter((p) => !p.published).length ?? 0}
            </span>
            <span className={styles.statLabel}>Drafts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
