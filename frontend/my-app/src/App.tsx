import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import SongList from "./pages/SongList.jsx";
import SongDetail from "./pages/SongDetail.jsx";
import SongForm from "./pages/SongForm.jsx";
import ProjectList from "./pages/ProjectList.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import ProjectForm from "./pages/ProjectForm.jsx";
import Settings from "./pages/Settings.jsx";
import CheckEmail from "./pages/CheckEmail.jsx";
import Dashboard from "./pages/Dashboard.jsx";

import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  const { user } = useAuth(); // ← parentheses

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/check-email" element={<CheckEmail />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Protected — all wrapped in ProtectedRoute + Layout */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/songs" element={<SongList />} />
        <Route path="/songs/new" element={<SongForm />} />
        <Route path="/songs/:id" element={<SongDetail />} />
        <Route path="/songs/:id/edit" element={<SongForm />} />

        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/new" element={<ProjectForm />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/projects/:id/edit" element={<ProjectForm />} />

        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Root redirect */}
      <Route
        path="/"
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
}

export default App;
