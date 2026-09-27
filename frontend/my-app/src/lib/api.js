const PORT = 3001;
const BASE_URL = `http://localhost:${PORT}`;

const getToken = () => localStorage.getItem("token");

function handleUnauthorized() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

async function request(method, path, body) {
  const headers = {};
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body !== undefined) {
    headers[`Content-Type`] = "application/json";
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, options);

  if (res.status === 401) {
    handleUnauthorized();
    throw new Error("Not authorized");
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

async function upload(path, formData) {
  const headers = {};
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (res.status === 401) {
    handleUnauthorized();
    throw new Error("Not authorized");
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  del: (path) => request("DELETE", path),
  upload,
};

// const PORT = 3001;
// const API_URL = `http://localhost:${PORT}/api/auth`;

// const getToken = () => localStorage.getItem("token");

// const request = async (endpoint, options = {}) => {
//     const headers = {
//         'Content-Type': 'application/json',
//         ...options.headers, //this line is used to merge the headers from the options object with the default headers. It allows you to add custom headers to the request while still keeping the default headers intact.
//     };

//     const token = getToken();
//     if (token) {
//         headers["Authorization"] = `Bearer ${token}`;
//     }

//     const response = await fetch(`${API_URL}${endpoint}`, {
//         ...options,
//         headers,
//     });

//     const data = await response.json();
//     if (!response.ok) {
//         throw new Error(data.message || "Something went wrong");
//     }
//     return data;
// };

// export const authAPI = {
//     Register: (userData) => request("/register", {
//         method: "POST",
//         body: JSON.stringify(userData),
//     }),
//     Login: (userData) => request("/login", {
//         method: "POST",
//         body: JSON.stringify(userData),
//     }),
//     Profile: () => request("/profile", {
//         method: "GET",
//     }),
// }
