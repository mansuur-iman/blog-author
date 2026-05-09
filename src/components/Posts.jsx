import { useEffect, useState } from "react";
import { useAuth } from "./context/useAuth";
import { getUser, deletePost, togglePublish, searchPost } from "../api/post";
import { useNavigate, Navigate } from "react-router";
import { Search } from "lucide-react";
import styles from "./Posts.module.css";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { token, user } = useAuth();
  const navigate = useNavigate();

  if (!token || !user) return <Navigate to="/login" replace />;

  const fetchAllPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getUser(token);
      setPosts(data.posts || data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAllPosts();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      setLoading(true);
      await deletePost(id, token);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id, published) => {
    try {
      setLoading(true);
      const updated = await togglePublish(id, published, token);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, published: updated.post.published } : p,
        ),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchAllPosts();
      return;
    }
    try {
      setLoading(true);
      setError("");
      const data = await searchPost(searchTerm, token);
      // bug fix: was data || data.posts — short-circuits before checking .posts
      setPosts(data.posts || data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const displayedPosts = posts.slice(0, 15);

  return (
    <div className={styles.container}>
      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <Search size={18} className={styles.searchIcon} aria-hidden />
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        {searchTerm && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => {
              setSearchTerm("");
              fetchAllPosts();
            }}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </form>

      {loading && <p className={styles.loading}>Loading...</p>}

      {/* Desktop table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Description</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && displayedPosts.length === 0 ? (
              <tr>
                <td colSpan="5" className={styles.noData}>
                  No posts found.
                </td>
              </tr>
            ) : (
              displayedPosts.map((p) => (
                <tr key={p.id}>
                  <td className={styles.titleCell}>{p.title}</td>
                  <td>
                    <span
                      className={
                        p.published ? styles.badgePublished : styles.badgeDraft
                      }
                    >
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className={styles.descCell}>
                    {p.description || (
                      <span className={styles.noDesc}>No description</span>
                    )}
                  </td>
                  <td className={styles.dateCell}>
                    {new Date(p.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => navigate(`/posts/${p.id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.toggleBtn}
                        onClick={() => handleToggle(p.id, p.published)}
                      >
                        {p.published ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        className={styles.commentsBtn}
                        onClick={() => navigate(`/posts/${p.id}/comments`)}
                      >
                        Comments
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </button>
                    </div>
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
          displayedPosts.map((p) => (
            <div key={p.id} className={styles.mobileCard}>
              <div className={styles.mobileCardHeader}>
                <p className={styles.mobileTitle}>{p.title}</p>
                <span
                  className={
                    p.published ? styles.badgePublished : styles.badgeDraft
                  }
                >
                  {p.published ? "Published" : "Draft"}
                </span>
              </div>
              {p.description && (
                <p className={styles.mobileDesc}>{p.description}</p>
              )}
              <p className={styles.mobileDate}>
                {new Date(p.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <div className={styles.mobileActions}>
                <button
                  className={styles.editBtn}
                  onClick={() => navigate(`/posts/${p.id}/edit`)}
                >
                  Edit
                </button>
                <button
                  className={styles.toggleBtn}
                  onClick={() => handleToggle(p.id, p.published)}
                >
                  {p.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  className={styles.commentsBtn}
                  onClick={() => navigate(`/posts/${p.id}/comments`)}
                >
                  Comments
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
