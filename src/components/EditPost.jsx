import { useState, useEffect } from "react";
import PostForm from "./PostForm";
import { useAuth } from "./context/useAuth";
import { updatePost, getPost } from "../api/post";
import { useNavigate, useParams } from "react-router";

export default function EditPost() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);

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
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchPost();
  }, [id, token]);

  if (!user || user.role !== "AUTHOR") {
    return <p>Access denied.</p>;
  }

  const handleUpdate = async (data) => {
    try {
      setLoading(true);
      await updatePost(id, data, token);
      navigate("/posts");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading post data...</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <>
      <h2 style={{ textAlign: "center" }}>Edit post</h2>
      <PostForm initialData={post} onSubmit={handleUpdate} loading={loading} />
    </>
  );
}
