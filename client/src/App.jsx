import { useEffect, useState } from "react";
import { api } from "./services/api";

export default function App() {
  const [status, setStatus] = useState("checking");
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/health/db")
      .then((res) => setStatus(res.database))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Task Manager</h1>
      {error ? <p>API error: {error}</p> : <p>Database: {status}</p>}
    </main>
  );
}
