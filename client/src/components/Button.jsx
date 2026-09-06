export default function Button({ children, isLoading, ...props }) {
  return (
    <button {...props} disabled={isLoading || props.disabled} style={{ padding: "0.5rem 1rem", cursor: isLoading ? "wait" : "pointer" }}>
      {isLoading ? "Please wait..." : children}
    </button>
  );
}
