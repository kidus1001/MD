import {useState} from "react";

import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";

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
    <div>
      <h1>Mezmur Debter</h1>
      {user? (
          <>
            <p>Welcome, {user.name}!</p>
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
  )
}


export default App;