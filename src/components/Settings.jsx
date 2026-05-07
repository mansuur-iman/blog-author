import { useEffect, useState } from "react";
import { useAuth } from "./context/useAuth";
import styles from "./Settings.module.css";
import { getUser } from "../api/post";

export default function Settings() {
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { token, user } = useAuth();

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUser(token);
        console.log("userData", userData);
        setAuthor(userData);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    if (token && user && user.role === "AUTHOR") fetchUser();
  }, [token, user]);

  if (!user || user.role !== "AUTHOR") {
    return <p>Access denied.</p>;
  }
  if (loading) return null;
  if (!author) return <p>User not found.</p>;

  return (
    <div className={styles.container}>
      {error && <p>{error}</p>}
      <header className={styles.header}>
        <div className={styles.avatarLarge}>
          {author.username ? author.username.charAt(0).toUpperCase() : "K"}
        </div>
        <h1 className={styles.title}>{author.username}'s Profile</h1>
      </header>

      <div className={styles.card}>
        <div className={styles.fieldGroup}>
          <label>First Name</label>
          <p className={styles.value}>{author.first_name || "Not set"}</p>
        </div>

        <div className={styles.fieldGroup}>
          <label>Last Name</label>
          <p className={styles.value}>{author.last_name || "Not set"}</p>
        </div>

        <div className={styles.fieldGroup}>
          <label>Username</label>
          <p className={styles.value}>{author.username || "Not set"}</p>
        </div>

        <div className={styles.fieldGroup}>
          <label>Email</label>
          <p className={styles.value}>{author.email || "Not set"}</p>
        </div>

        <div className={styles.fieldGroup}>
          <label>Account Role</label>
          <span className={styles.badge}>{author.role}</span>
        </div>
      </div>
    </div>
  );
}
