import { useState } from "react";
import { authAPI } from "../api";

function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    }); //This is a state variable that holds the form data. It is initialized with an object that has three properties: name, email, and password. The setForm function is used to update the form data.

    const [message, setMessage] = useState(""); //This is a state variable that holds the message to be displayed to the user. It is initialized with an empty string. The setMessage function is used to update the message.
    const [loading, setLoading] = useState(false); //This is a state variable that holds the loading state of the form submission. It is initialized with false. The setLoading function is used to update the loading state.

    const handleChange = (e) => {
        setForm ({...form, [e.target.name]: e.target.value}); //This function is called when the user types in the form fields. It updates the form data with the new value of the field that was changed. The e.target.name property is used to determine which field was changed, and the e.target.value property is used to get the new value of that field.
    }

    const handleSubmit = async (e) => { //this is called a higher-order function. It is a function that returns another function. In this case, it is a function that returns an async function. The async function is used to handle the form submission. It is called when the user submits the form.
        e.preventDefault(); //This is used to prevent the default behavior of the form submission, which is to reload the page. We want to handle the form submission using JavaScript instead of reloading the page.
        setLoading(true); //This is used to set the loading state to true, which will disable the form fields and show a loading spinner.
        setMessage(""); //This is used to clear the message before submitting the form.
        try {
            const data = await authAPI.Register(form); //This is used to call the register function from the authAPI module. It sends a POST request to the backend with the form data. The response from the backend is stored in the data variable.
            localStorage.setItem("token", data.token); //This is used to store the token in the local storage of the browser. The token is used to authenticate the user in future requests.
            localStorage.setItem("user", JSON.stringify(data.user)); //This is used to store the user data in the local storage of the browser. The user data is stored as a string using JSON.stringify() method.
            setMessage("User Registered Successfully"); //This is used to set the message to be displayed to the user after successful registration.
        } catch (error) {
            setMessage(`${error.message}`); //This is used to set the message to be displayed to the user in case of an error.
        } finally {
            setLoading(false); //This is used to set the loading state to false, which will enable the form fields and hide the loading spinner.
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            <button type="submit" disabled={loading}>{loading ? "Loading..." : "Register"}</button>
            {message && <p>{message}</p>}
        </form>
    )
}

export default Register;