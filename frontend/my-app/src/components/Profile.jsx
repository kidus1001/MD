import {useEffect, useState} from "react"; //Useeffect is a hook that allows us to perform side effects in our components. It is used to fetch the user data from the backend when the component mounts. UseState is a hook that allows us to add state to our functional components. It is used to store the user data and the loading state.
import { authAPI } from "../api"; //authAPI is a module that contains functions to interact with the backend API. It is used to fetch the user data from the backend.

function Profile () {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    useEffect (() => {
        const fetchProfile = async () => {
            try {
                const data = await authAPI.Profile();
                setUser(data.user);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchProfile();
    }, []);

    if (error) return <p>error</p>;
    if (!user) return <p>Loading</p>;

    return (
        <div>
            <h2>Profile</h2>
            <p><strong>Name:</strong>{user.name}</p>
            <p><strong>Email:</strong>{user.email}</p>
            <p><strong>Joined:</strong>{new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
    )
};




export default Profile;