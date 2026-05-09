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
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleEditorChange = (content) => {
    setFormData((prev) => ({ ...prev, text: content }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.text) {
      setError("Title and content are required.");
      return; // bug fix: was missing return, always called onSubmit
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleFormSubmit} className={styles.postForm}>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="title">
          Title
        </label>
        <input
          className={styles.input}
          id="title"
          type="text"
          name="title"
          placeholder="Your post title..."
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Content</label>
        <div className={styles.editorWrapper}>
          <Editor
            apiKey="gbvuoiqrid4530voc09berim1b65mu83ajvbsfa496qpzjac"
            value={formData.text}
            onEditorChange={handleEditorChange}
            init={{ height: 400, menubar: true }}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="description">
          Description
        </label>
        <input
          className={styles.input}
          id="description"
          type="text"
          name="description"
          placeholder="Short summary shown in previews..."
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="imageUrl">
          Cover image URL
        </label>
        <input
          className={styles.input}
          id="imageUrl"
          type="text"
          name="imageUrl"
          placeholder="https://..."
          value={formData.imageUrl}
          onChange={handleChange}
        />
        {formData.imageUrl && (
          <img
            src={formData.imageUrl}
            alt="Cover preview"
            className={styles.imagePreview}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        )}
      </div>

      <div className={styles.toggleRow}>
        <div className={styles.toggleInfo}>
          <span className={styles.label}>Publish</span>
          <span className={styles.toggleHint}>
            {formData.published ? "Visible to readers" : "Saved as draft"}
          </span>
        </div>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            name="published"
            id="published"
            checked={formData.published}
            onChange={handleChange}
          />
          <span className={styles.toggleTrack}>
            <span className={styles.toggleThumb} />
          </span>
        </label>
      </div>

      <button type="submit" disabled={loading} className={styles.submitBtn}>
        {loading ? "Saving..." : "Save post"}
      </button>
    </form>
  );
}
