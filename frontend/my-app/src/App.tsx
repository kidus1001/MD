import { useState } from "react";
import { Routes, Route } from 'react-router-dom'

import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import VerifyEmail from './pages/VerifyEmail';

function App () {
  const [user, setUser] = useState (
    JSON.parse(localStorage.getItem("user")) || null
  );

  const handleLogout = () => {
    localStorage.removeItem ("token");
    localStorage.removeItem ("user");
    setUser(null);
  };

  return (
    <>
      <Routes>
        <Route path="/verify-email" element={<VerifyEmail/>}/>
      </Routes>
      <div>
        <h1 className="text-3xl font-bold underline">Mezmur Debter</h1>
        {user? (
            <>
              <p className="bg-blue">Welcome, {user.name}!</p>
              <button onClick={handleLogout}>Logout</button>
              <Profile/>
            </>
          ) : (
            <>
              <Register/>
              <hr/>
              <Login onLogin={setUser}/>
            </>
          )}
      </div>
    </>
  )
}


export default App;