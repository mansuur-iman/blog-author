const BASE_URL = "https://blog-api-7iix.onrender.com/api/v1/posts";

export const getUser = async (token) => {
  const res = await fetch(
    "https://blog-api-7iix.onrender.com/api/v1/users/me",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || "Failed to fetch user.");
  }
  return res.json();
};

export const getPosts = async (token) => {
  const res = await fetch(`${BASE_URL}?sort=desc&page=1&limit=10`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    // This will catch the "not authorized" message from the server
    throw new Error(errorData.msg || "Failed to fetch posts.");
  }
  return res.json();
};

export const getPost = async (id, token) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || "Failed to fetch post.");
  }

  return res.json();
};

export const createPost = async (data, token) => {
  const res = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || "Failed to create post.");
  }

  return res.json();
};

export const updatePost = async (id, data, token) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || "Failed to create post.");
  }
  return res.json();
};

export const deletePost = async (id, token) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || "Failed to delete post.");
  }
};

export const togglePublish = async (id, published, token) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      published: !published,
    }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || "Failed to update publish status.");
  }

  return res.json();
};

export const searchPost = async (searchTerm, token) => {
  const res = await fetch(
    `${BASE_URL}/search?term=${encodeURIComponent(searchTerm)}&page=1&limit=10&sort=desc`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || "Failed to fetch post.");
  }

  return res.json();
};

export const getPostById = async (id, token) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || "Failed to fetch post.");
  }
  return res.json();
};
