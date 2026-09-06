import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await register(form);
      navigate("/tasks", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 380, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Create account</h1>

      <form onSubmit={handleSubmit} noValidate>
        <Input label="Name" name="name" value={form.name} onChange={handleChange} required />

        <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />

        <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} required minLength={8} />

        {error && <p style={{ color: "#c00" }}>{error}</p>}

        <Button type="submit" isLoading={isSubmitting}>
          Create account
        </Button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
