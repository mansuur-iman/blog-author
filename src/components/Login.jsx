import { useState } from "react";
import { useAuth } from "./context/useAuth";
import { useNavigate } from "react-router";
import styles from "./Login.module.css";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const formEmail = formData.email;
  const formPassword = formData.password;

  const navigate = useNavigate();

  const valiadte = () => {
    const newErrors = {};

    if (!formEmail || formEmail === "" || !formEmail.includes("@"))
      newErrors.email = "Email is required or invalid email.";

    if (!formPassword || formPassword === "" || formPassword.length < 8)
      newErrors.password =
        "Password is required and Password Must be atleast 8 characters.";

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const validattionErrors = valiadte();

    if (Object.keys(validattionErrors).length > 0) {
      setErrors(validattionErrors);
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      const res = await fetch(
        "https://blog-api-7iix.onrender.com/api/v1/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formEmail,
            password: formPassword,
          }),
        },
      );

      const data = await res.json();
      console.log("API response", data);

      if (!res.ok) {
        setErrors({ APIerror: data.msg || "Login failed." });
        return;
      }

      if (!data.user || data.user.role !== "AUTHOR") {
        setErrors({ APIerror: "Access denied." });
        return;
      }

      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      console.error(err);
      setErrors({ errors: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {loading && <p>loading....</p>}
      {errors.APIerror && <p className={styles.error}>{errors.APIerror}</p>}
      <h1 className={styles.title}>Welcome Back.</h1>
      <p className={styles.subtitle}>Login to access your Account.</p>
      <form onSubmit={handleFormSubmit} className={styles.card}>
        <div className={styles.inputGroup}>
          <input
            type="email"
            name="email"
            value={formEmail || ""}
            onChange={handleChange}
            autoComplete="email"
            placeholder="Email"
            required
          />
          {errors.email && <p>{errors.email}</p>}
        </div>
        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formPassword || ""}
            onChange={handleChange}
            autoComplete="password"
            required
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
