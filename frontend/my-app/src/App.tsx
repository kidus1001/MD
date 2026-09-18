import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import SongList from "./pages/SongList";
import SongDetail from "./pages/SongDetail";
import SongForm from "./pages/SongForm";
import ProjectList from "./pages/ProjectList";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectForm from "./pages/ProjectForm";
import Settings from "./pages/Settings";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { user } = useAuth;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/songs" element={<SongList />}>
          <Route path="/songs/new" element={<SongForm />} />
          <Route path="/songs/:id" element={<SongDetail />} />
          <Route path="/songs/:id/edit" element={<SongForm />} />

          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/new" element={<ProjectForm />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/projects/:id/edit" element={<ProjectForm />} />

          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
      <Route
        path="/"
        element={<Navigate to={user ? "/projects" : "/login"} replace />}
      />
    </Routes>
  );
}

export default App;

// import { useState } from "react";
// import { Routes, Route } from 'react-router-dom'

// import Register from "./components/Register";
// import Login from "./components/Login";
// import Profile from "./components/Profile";
// import VerifyEmail from './pages/VerifyEmail';

// function App () {
//   const [user, setUser] = useState (
//     JSON.parse(localStorage.getItem("user")) || null
//   );

//   const handleLogout = () => {
//     localStorage.removeItem ("token");
//     localStorage.removeItem ("user");
//     setUser(null);
//   };

//   return (
//     <>
//       <Routes>
//         <Route path="/verify-email" element={<VerifyEmail/>}/>
//       </Routes>
//       <div>
//         <h1 className="text-3xl font-bold underline">Mezmur Debter</h1>
//         {user? (
//             <>
//               <p className="bg-blue">Welcome, {user.name}!</p>
//               <button onClick={handleLogout}>Logout</button>
//               <Profile/>
//             </>
//           ) : (
//             <>
//               <Register/>
//               <hr/>
//               <Login onLogin={setUser}/>
//             </>
//           )}
//       </div>
//     </>
//   )
// }

// export default App;
