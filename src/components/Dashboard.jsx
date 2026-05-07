import { useState, useEffect } from "react";
import { useAuth } from "./context/useAuth";
import { getUser } from "../api/post";
import { useNavigate, Navigate } from "react-router";
import { Plus } from "lucide-react";
import styles from "./Dashboard.module.css";
export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const userData = await getUser(token);
        console.log("USER", userData);
        setPosts(userData.posts || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token && user.id && user.role === "AUTHOR") fetchPosts();
  }, [token, user]);

  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.filter((p) => !p.published).length;

  if (loading) return <p>loading...</p>;
  if (!token || !user) return <Navigate to="/login" replace />;
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
          <h3>Draft</h3>
          <p>{draftCount}</p>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && posts.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No posts found.
                </td>
              </tr>
            )}
            {posts.slice(0, 15).map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.published ? "Published" : "Draft"}</td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td>
                  <button type="button" onClick={() => navigate("/posts")}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
