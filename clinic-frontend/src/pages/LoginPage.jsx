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

    try {
      // Fetch all users (you can later improve this by making a login endpoint)
      const res = await fetch(`${API_BASE_URL}/api/users`); // adjust if needed
      const users = await res.json();

      const foundUser = users.find((u) => u.userName === username);
      if (!foundUser) {
        return setError("User not found.");
      }

      // Check password using bcrypt in browser
      const bcrypt = await import("bcryptjs"); // dynamic import to avoid SSR issues
      const isMatch = await bcrypt.compare(password, foundUser.passwordHash);

      if (!isMatch) {
        return setError("Incorrect password.");
      }

      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(foundUser));
      setUser(foundUser);
      navigate("/doctors");
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
        <h2 className="text-2xl font-bold text-center mb-6 text-pink-600">
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
          className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
        >
          Login
        </button>

      </form>
    </div>
  );
}

export default LoginPage;
