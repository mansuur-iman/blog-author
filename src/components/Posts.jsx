import { useEffect, useState } from "react";
import { useAuth } from "./context/useAuth";
import { getUser, deletePost, togglePublish, searchPost } from "../api/post";
import { useNavigate, Navigate } from "react-router";
import { Plus, Search } from "lucide-react";
import styles from "./Posts.module.css";

export default function Posts() {
  const [post, setPost] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { token, user } = useAuth();
  const navigate = useNavigate();

  const fetchAllPosts = async () => {
    setLoading(true);
    try {
      const data = await getUser(token);
      console.log("userData", data);
      setPost(data.posts || data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAllPosts();
  }, [token]);

  if (!token || !user) return <Navigate to="/login" replace />;

  const handleDelete = async (id) => {
    try {
      setLoading(true);

      await deletePost(id, token);
      setPost((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id, published) => {
    try {
      setLoading(true);
      const updated = await togglePublish(id, published, token);

      setPost((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, published: updated.post.published } : p,
        ),
      );
    } catch (err) {
      console.error(err);
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
      const data = await searchPost(searchTerm, token);
      setPost(data || data.posts || []);
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <Search size={25} />
        <input
          type="text"
          placeholder="search post..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
          required
        />
      </form>
      {loading && <span className={styles.loading}>Searching...</span>}

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
          {!loading && post.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No posts found.
              </td>
            </tr>
          )}
          {post.slice(0, 15).map((p) => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{p.published ? "Published" : "Draft"}</td>
              <td>{p.description ? p.description : "NO description"}</td>
              <td>{new Date(p.createdAt).toLocaleDateString()}</td>
              <td className={styles.actions}>
                <button
                  className={styles.edit}
                  onClick={() => navigate(`/posts/${p.id}/edit`)}
                >
                  Edit
                </button>

                <button
                  className={styles.delete}
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>

                <button
                  className={styles.toggle}
                  onClick={() => handleToggle(p.id, p.published)}
                >
                  {p.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  className={styles.comments}
                  onClick={() => navigate(`/posts/${p.id}/comments`)}
                >
                  View Comments
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
