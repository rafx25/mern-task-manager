import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../context/auth-context.js";

const linkStyle = ({ isActive }) => ({
  marginRight: "1rem",
  fontWeight: isActive ? 600 : 400,
});

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          borderBottom: "1px solid #ddd",
        }}
      >
        <nav>
          <NavLink to="/tasks" style={linkStyle}>
            Tasks
          </NavLink>

          {user?.role === "admin" && (
            <NavLink to="/admin/users" style={linkStyle}>
              Users
            </NavLink>
          )}
        </nav>

        <div>
          <span style={{ marginRight: "1rem" }}>{user?.name}</span>
          <button onClick={handleLogout}>Sign out</button>
        </div>
      </header>

      <main style={{ padding: "1rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
