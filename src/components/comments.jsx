import { getComments, deleteComment } from "../api/comment";
import { useState, useEffect } from "react";
import { useAuth } from "./context/useAuth";
import { useParams } from "react-router";
import { getPost } from "../api/post";
import styles from "./comments.module.css";

export default function Comments() {
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  const { token } = useAuth();
  const { id } = useParams();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);

        const postData = await getPost(id, token);
        setPost(postData);

        const fetchedComments = await getComments(postData.id, token);
        setComments(fetchedComments);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchComments();
  }, [id, token]);

  const handleDelete = async (commentId) => {
    try {
      setLoading(true);

      await deleteComment(commentId, token);

      setComments((prev) =>
        prev.filter((c) => c.id !== commentId && c._id !== commentId),
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {loading && <p className={styles.loading}>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {post && <h2 className={styles.title}>Comments for "{post.title}"</h2>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Comment</th>
            <th>Author</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {comments.length === 0 ? (
            <tr>
              <td colSpan="4" className={styles.empty}>
                No comments yet.
              </td>
            </tr>
          ) : (
            comments.map((c) => (
              <tr key={c.id}>
                <td>{c.text}</td>
                <td>{c.author.username}</td>
                <td>
                  {new Date(c.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleDelete(c.id)}
                    className={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
