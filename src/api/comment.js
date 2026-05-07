const BASE_URL = "https://blog-api-7iix.onrender.com/api/v1/posts";

export const getComments = async (postId, token) => {
  const res = await fetch(
    `${BASE_URL}/${postId}/comments?page=1&limit=10&sort=desc`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) throw new Error("failed to fetch comment.");
  return res.json();
};

export const deleteComment = async (commentId, token) => {
  const res = await fetch(
    `https://blog-api-7iix.onrender.com/api/v1/comments/${commentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.log("DELETE ERROR:", res.status, errorText);
    throw new Error("failed to delete comment.");
  }
};
