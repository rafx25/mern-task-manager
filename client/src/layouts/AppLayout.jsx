import { NavLink, Outlet } from "react-router";

const linkStyle = ({ isActive }) => ({
  marginRight: "1rem",
  fontWeight: isActive ? 600 : 400,
});

export default function AppLayout() {
  return (
    <div>
      <header style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
        <nav>
          <NavLink to="/tasks" style={linkStyle}>
            Tasks
          </NavLink>
          <NavLink to="/admin/users" style={linkStyle}>
            Users
          </NavLink>
        </nav>
      </header>

      <main style={{ padding: "1rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
