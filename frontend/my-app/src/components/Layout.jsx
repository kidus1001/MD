import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Nosta from "../assets/nostalgic.png";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const linkClass = ({ isActive }) =>
    `text-sm transition ${
      isActive ? "text-accent" : "text-text-muted hover:text-text"
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

      <div className="min-h-screen bg-grid flex flex-col">
        <nav>...</nav>

        <main className="max-w-5xl mx-auto p-6 w-full flex-1">
          <Outlet />
        </main>

        <footer className="border-t border-border mt-12">
          <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between gap-4 text-xs text-text-faint">
            <div>
              <span className="text-text-muted">Mezmur Debter</span>
              <span className="mx-2">·</span>
              <span>Lyric & Melody Organizer</span>
              <span className="mx-2">·</span>
              <span className="text-text-muted">
                <a
                  href="https://t.me/SoftwareAspirer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition"
                >
                  Kidus Yosef
                </a>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <img
                src={Nosta}
                alt="Nostalgic Logo"
                className="w-9 h-9 object-contain"
              />
              <p className="text-archive-dark text-sm">Nostalgic Begena</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
