import { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import styles from "./PostForm.module.css";

export default function PostForm({ initialData = {}, onSubmit, loading }) {
  const [formData, setFormData] = useState(() => ({
    title: initialData.title || "",
    text: initialData.text || "",
    description: initialData.description || "",
    imageUrl: initialData.imageUrl || "",
    published: initialData.published || false,
  }));
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setError("");
  };

  const handleEditorChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      text: content,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.text) {
      setError("Title and text are required.");
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleFormSubmit} className={styles.PostForm}>
      {error && <p>{error}</p>}
      <input
        className={styles.postInput}
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        autoComplete="title"
        onChange={handleChange}
        required
      />
      <div className={styles.editor}>
        <Editor
          apiKey="gbvuoiqrid4530voc09berim1b65mu83ajvbsfa496qpzjac"
          value={formData.text}
          onEditorChange={handleEditorChange}
          init={{ height: 400, menubar: true }}
        />
      </div>

      <input
        type="text"
        name="description"
        placeholder="description"
        value={formData.description}
        autoComplete="description"
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Image"
        name="imageUrl"
        value={formData.imageUrl}
        onChange={handleChange}
      />
      <div>
        <label htmlFor="published">Publish post</label>

        <input
          type="checkbox"
          name="published"
          id="published"
          checked={formData.published}
          onChange={handleChange}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "saving.." : "save"}
      </button>
    </form>
  );
}
