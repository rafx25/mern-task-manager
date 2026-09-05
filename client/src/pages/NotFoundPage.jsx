import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>404</h1>
      <p>That page does not exist.</p>
      <Link to="/tasks">Back to tasks</Link>
    </div>
  );
}
