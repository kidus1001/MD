import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  // ... form state, submit handler

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await api.post("/api/auth/login", { email, password });
      login(data.user, data.token); // ← this instead of onLogin(...)
      navigate("/projects"); // ← redirect after login
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Loading..." : "Login"}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
