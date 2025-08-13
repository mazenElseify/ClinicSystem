import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from '../config';

function LoginPage({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Fetch all users (you can later improve this by making a login endpoint)
      const res = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({ userName: username, password}),
      }); // adjust if needed
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.message || "Login failed.");
        return;
      }
      const user = await res.json();
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", user.token);
      setUser(user);
      navigate("/home");
      
      if (user.role === "Doctor") {
        // Fetch doctor profile and set doctorId in user object
        const doctorRes = await axios.get(`${API_BASE_URL}/doctors/by-user/${user.id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        user.doctorId = doctorRes.data.id;
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user); // update state
      }

    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Login to Clinic System
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-1 font-medium">Username</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

      </form>
    </div>
  );
}

export default LoginPage;
