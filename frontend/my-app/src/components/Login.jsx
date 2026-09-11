import { useState } from "react";
import { authAPI } from "../api";

function Login ({onLogin}) { //onlogin here is a prop that is passed from the parent component (App.jsx) to the child component (Login.jsx). It is a function that is called when the user successfully logs in. It is used to update the state of the parent component (App.jsx) with the user data and token.
    const [form, setForm] = useState ({email: "", password: ""});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm ({ ...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const data = await authAPI.Login(form);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setMessage("User Logged In Successfully");
            if (onLogin) {
                onLogin(data.user, data.token); //Call the onLogin function passed from the parent component (App.jsx) with the user data and token as arguments. This will update the state of the parent component (App.jsx) with the user data and token.
            }
        } catch (error) {
            setMessage(`${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            <button type="submit" disabled={loading}>{loading ? "Loading..." : "Login"}</button>
            {message && <p>{message}</p>}
        </form>
    );
}


export default Login;