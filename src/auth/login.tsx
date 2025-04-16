import React, { useState } from "react";
import { GoogleOutlined, GithubOutlined } from "@ant-design/icons";

const Login: React.FC = () => {
  const [email, setEmail] = useState("sampleuser@email.com");
  const [password, setPassword] = useState("********");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:3333/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error("Login failed");
      const { token } = await response.json();
      localStorage.setItem("authToken", token);
      window.location.href = "/";
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Image */}
      <div className="lg:block w-1/2 ">
        <img
          src="/hospital_image.png"
          alt="Hospital"
        />
      </div>
      {/* Right: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-6" style={{ maxWidth: '500px', maxHeight: '600px' }}>
          <h2 className="text-2xl font-bold text-gray-800"><strong>Account Login</strong></h2>
          <p className="text-sm text-gray-500">
            If you are already a member you can login with your email address and password.
          </p>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-300"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" id="remember" />
                <label htmlFor="remember" className="text-sm">Remember me</label>
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
            </div>
            <button
              type="submit"
              className="w-full bg-[#A51424] text-white py-2 rounded-md hover:bg-[#86121d] transition-shadow duration-300"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="text-sm text-center text-gray-500 mt-6">
            Don’t have an account?{" "}
            <a href="/register" className="text-red-600 hover:underline">Sign up here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;