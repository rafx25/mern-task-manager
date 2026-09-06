export default function Input({ label, error, ...props }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", marginBottom: "0.25rem" }}>{label}</label>
      <input
        {...props}
        style={{
          width: "100%",
          padding: "0.5rem",
          border: `1px solid ${error ? "#c00" : "#ccc"}`,
        }}
      />
      {error && <p style={{ color: "#c00", fontSize: "0.85rem" }}>{error}</p>}
    </div>
  );
}
