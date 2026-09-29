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
    <div className="min-h-screen bg-grid flex flex-col">
      {/* Nav */}
      <nav className="bg-surface border-b border-border">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-3">
          {/* Top row — brand + user actions */}
          <div className="flex items-center justify-between gap-3">
            <Link
              to="/dashboard"
              className="text-sm font-medium text-text tracking-tight shrink-0"
            >
              Mezmur Debter
            </Link>

            {/* On mobile, only show user + sign-out (compact) */}
            <div className="flex items-center gap-3 md:gap-5">
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `text-xs transition ${
                    isActive
                      ? "text-accent"
                      : "text-text-faint hover:text-accent"
                  }`
                }
              >
                {user?.name}
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-xs text-text-faint hover:text-error transition"
              >
                Sign out
              </button>
            </div>
          </div>

          {/* Second row — main nav links */}
          <div className="flex items-center gap-5 mt-3 md:mt-0">
            <NavLink to="/projects" className={linkClass}>
              Projects
            </NavLink>
            <NavLink to="/songs" className={linkClass}>
              Songs
            </NavLink>
            <NavLink
              to="/settings"
              className={`md:hidden ${linkClass({ isActive: false })}`}
            >
              Settings
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 w-full flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-faint">
          {/* Left: brand + credit */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1 text-center sm:text-left">
            <span className="text-text-muted">Mezmur Debter</span>
            <span className="hidden sm:inline">·</span>
            <span>Lyric & Melody Organizer</span>
            <span className="hidden sm:inline">·</span>
            <a
              href="https://t.me/SoftwareAspirer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent transition"
            >
              Kidus Yosef
            </a>
          </div>

          {/* Right: logo */}
          <div className="flex items-center gap-2">
            <img
              src={Nosta}
              alt="Nostalgic Logo"
              className="w-7 h-7 sm:w-9 sm:h-9 object-contain"
            />
            <p className="text-archive-dark text-xs sm:text-sm">
              Nostalgic Begena
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
