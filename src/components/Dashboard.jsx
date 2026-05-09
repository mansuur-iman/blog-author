import { useState, useEffect } from "react";
import { useAuth } from "./context/useAuth";
import { getUser } from "../api/post";
import { Navigate } from "react-router";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { token, user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const userData = await getUser(token);
        setPosts(userData.posts || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token && user?.id && user?.role === "AUTHOR") fetchPosts();
  }, [token, user]);

  if (!token || !user) return <Navigate to="/login" replace />;

  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.filter((p) => !p.published).length;
  const displayedPosts = posts.slice(0, 15);

  return (
    <div className={styles.container}>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.stats}>
        <div className={styles.card}>
          <h3>Total Posts</h3>
          <p>{posts.length}</p>
        </div>
        <div className={styles.card}>
          <h3>Published</h3>
          <p>{publishedCount}</p>
        </div>
        <div className={styles.card}>
          <h3>Drafts</h3>
          <p>{draftCount}</p>
        </div>
      </div>

      {loading && <p className={styles.loading}>Loading...</p>}

      {/* Desktop table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {!loading && displayedPosts.length === 0 ? (
              <tr>
                <td colSpan="3" className={styles.noData}>
                  No posts found.
                </td>
              </tr>
            ) : (
              displayedPosts.map((post) => (
                <tr key={post.id}>
                  <td className={styles.postTitle}>{post.title}</td>
                  <td>
                    <span
                      className={
                        post.published
                          ? styles.badgePublished
                          : styles.badgeDraft
                      }
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className={styles.date}>
                    {new Date(post.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className={styles.mobileList}>
        {!loading && displayedPosts.length === 0 ? (
          <p className={styles.noDataMobile}>No posts found.</p>
        ) : (
          displayedPosts.map((post) => (
            <div key={post.id} className={styles.mobileCard}>
              <div className={styles.mobileCardTop}>
                <p className={styles.postTitle}>{post.title}</p>
                <span
                  className={
                    post.published ? styles.badgePublished : styles.badgeDraft
                  }
                >
                  {post.published ? "Published" : "Draft"}
                </span>
              </div>
              <p className={styles.date}>
                {new Date(post.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
