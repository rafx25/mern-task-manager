import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "../context/auth-context.js";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(form);

      // Send them back where they were headed before the guard intercepted.
      navigate(location.state?.from ?? "/tasks", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 380, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Sign in</h1>

      <form onSubmit={handleSubmit} noValidate>
        <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />

        <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />

        {error && <p style={{ color: "#c00" }}>{error}</p>}

        <Button type="submit" isLoading={isSubmitting}>
          Sign in
        </Button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        No account? <Link to="/register">Create one</Link>
      </p>
    </div>
  );
}
