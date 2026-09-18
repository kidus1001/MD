import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await api.post("/api/auth/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-1">Create your account</h1>
        <p className="text-gray-600 text-sm mb-6">Mezmur Debter</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-purple-700 hover:bg-purple-800 disabled:bg-purple-300 text-white font-medium rounded py-2 transition"
          >
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-700 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

// import { useState } from "react";
// import { authAPI } from "../api";

// function Register() {
//     const [form, setForm] = useState({
//         name: "",
//         email: "",
//         password: "",
//     }); //This is a state variable that holds the form data. It is initialized with an object that has three properties: name, email, and password. The setForm function is used to update the form data.

//     const [message, setMessage] = useState(""); //This is a state variable that holds the message to be displayed to the user. It is initialized with an empty string. The setMessage function is used to update the message.
//     const [loading, setLoading] = useState(false); //This is a state variable that holds the loading state of the form submission. It is initialized with false. The setLoading function is used to update the loading state.

//     const handleChange = (e) => {
//         setForm ({...form, [e.target.name]: e.target.value}); //This function is called when the user types in the form fields. It updates the form data with the new value of the field that was changed. The e.target.name property is used to determine which field was changed, and the e.target.value property is used to get the new value of that field.
//     }

//     const handleSubmit = async (e) => { //this is called a higher-order function. It is a function that returns another function. In this case, it is a function that returns an async function. The async function is used to handle the form submission. It is called when the user submits the form.
//         e.preventDefault(); //This is used to prevent the default behavior of the form submission, which is to reload the page. We want to handle the form submission using JavaScript instead of reloading the page.
//         setLoading(true); //This is used to set the loading state to true, which will disable the form fields and show a loading spinner.
//         setMessage(""); //This is used to clear the message before submitting the form.
//         try {
//             const data = await authAPI.Register(form); //This is used to call the register function from the authAPI module. It sends a POST request to the backend with the form data. The response from the backend is stored in the data variable.
//             localStorage.setItem("token", data.token); //This is used to store the token in the local storage of the browser. The token is used to authenticate the user in future requests.
//             localStorage.setItem("user", JSON.stringify(data.user)); //This is used to store the user data in the local storage of the browser. The user data is stored as a string using JSON.stringify() method.
//             setMessage("User Registered Successfully"); //This is used to set the message to be displayed to the user after successful registration.
//         } catch (error) {
//             setMessage(`${error.message}`); //This is used to set the message to be displayed to the user in case of an error.
//         } finally {
//             setLoading(false); //This is used to set the loading state to false, which will enable the form fields and hide the loading spinner.
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <h2>Register</h2>
//             <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
//             <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
//             <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
//             <button type="submit" disabled={loading}>{loading ? "Loading..." : "Register"}</button>
//             {message && <p>{message}</p>}
//         </form>
//     )
// }

// export default Register;
