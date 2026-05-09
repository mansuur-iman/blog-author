import { useState } from "react";
import PostForm from "./PostForm";
import { createPost } from "../api/post";
import { useAuth } from "./context/useAuth";
import { useNavigate, Navigate } from "react-router";
import styles from "./NewPost.module.css";

export default function NewPost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { token, user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== "AUTHOR") return <Navigate to="/login" replace />;

  const handleCreatePost = async (data) => {
    try {
      setLoading(true);
      setError("");
      await createPost(data, token);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>Create new post</h2>
      {error && <p className={styles.error}>{error}</p>}
      <PostForm onSubmit={handleCreatePost} loading={loading} />
    </div>
  );
}
