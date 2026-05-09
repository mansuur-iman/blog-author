import { useState, useEffect } from "react";
import PostForm from "./PostForm";
import { useAuth } from "./context/useAuth";
import { updatePost, getPost } from "../api/post";
import { useNavigate, useParams, Navigate } from "react-router";
import styles from "./EditPost.module.css";

export default function EditPost() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { token, user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getPost(id, token);
        setPost(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchPost();
  }, [id, token]);

  if (!user || user.role !== "AUTHOR") return <Navigate to="/login" replace />;
  if (loading) return <p className={styles.status}>Loading post...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!post) return <p className={styles.status}>Post not found.</p>;

  const handleUpdate = async (data) => {
    try {
      setLoading(true);
      await updatePost(id, data, token);
      navigate("/posts");
    } catch (err) {
      console.error(err);
      setError("Failed to update post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>Edit post</h2>
      <PostForm initialData={post} onSubmit={handleUpdate} loading={loading} />
    </div>
  );
}
