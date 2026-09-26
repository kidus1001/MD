import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const linkClass = ({ isActive }) =>
    `text-sm transition ${
      isActive ? "text-text" : "text-text-muted hover:text-text"
    }`;

  return (
    <div className="min-h-screen bg-grid">
      <nav className="bg-surface border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Left: brand + nav links */}
          <div className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className="text-sm font-medium text-text tracking-tight"
            >
              Mezmur Debter
            </Link>
            <div className="flex items-center gap-5">
              <NavLink to="/projects" className={linkClass}>
                Projects
              </NavLink>
              <NavLink to="/songs" className={linkClass}>
                Songs
              </NavLink>
            </div>
          </div>

          {/* Right: user + settings + logout */}
          <div className="flex items-center gap-5">
            <span className="text-xs text-text-faint">{user?.name}</span>
            <NavLink to="/settings" className={linkClass}>
              Settings
            </NavLink>
            <button
              onClick={handleLogout}
              className="text-xs text-text-faint hover:text-error transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
