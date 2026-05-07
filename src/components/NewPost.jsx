import { useState } from "react";
import PostForm from "./PostForm";
import { createPost } from "../api/post";
import { useAuth } from "./context/useAuth";
import { useNavigate } from "react-router";

export default function NewPost() {
  const [loading, setLoading] = useState(false);

  const { token, user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== "AUTHOR") {
    return <p>Access denied.</p>;
  }

  const handleCreatePost = async (data) => {
    try {
      setLoading(true);

      await createPost(data, token);
      console.log("POST", data);
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 style={{ textAlign: "center" }}>Create New post</h2>
      <PostForm onSubmit={handleCreatePost} loading={loading} />
    </>
  );
}
