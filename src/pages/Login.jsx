import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://chatappbackend1122.netlify.app/user/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Login successful!");
        setEmail("");
        setPassword("");
        navigate("/users");
      } else {
        alert("Login failed: " + data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#8E2DE2] to-[#4A00E0] p-4">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-lg border border-white/30 text-white p-10 rounded-3xl shadow-2xl animate-fade-in transition-all duration-500">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8">
          Welcome Back
        </h2>
        <form onSubmit={login} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-white/30 text-white placeholder-white/80 outline-none focus:ring-2 focus:ring-white transition"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-white/30 text-white placeholder-white/80 outline-none focus:ring-2 focus:ring-white transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-purple-800 font-semibold py-3 rounded-xl shadow-md hover:bg-purple-100 transition duration-300"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-white/90 space-y-2">
          <p>
            Don’t have an account?{" "}
            <Link to="/register" className="underline hover:text-white font-medium">
              Register here
            </Link>
          </p>
          <p>
            <Link to="/" className="underline hover:text-white font-medium">
              Go to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
