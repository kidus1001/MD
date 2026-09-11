const PORT = 3001;
const API_URL = `http://localhost:${PORT}/api/auth`;

const getToken = () => localStorage.getItem("token");

const request = async (endpoint, options = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers, //this line is used to merge the headers from the options object with the default headers. It allows you to add custom headers to the request while still keeping the default headers intact.
    };

    const token = getToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }
    return data;
};


export const authAPI = {
    Register: (userData) => request("/register", {
        method: "POST",
        body: JSON.stringify(userData),
    }),
    Login: (userData) => request("/login", {
        method: "POST",
        body: JSON.stringify(userData),
    }),
    Profile: () => request("/profile", {
        method: "GET",
    }),
}