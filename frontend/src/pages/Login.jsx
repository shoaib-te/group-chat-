import { useState } from "react";
import axios from "../config/axios.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
// auth context hooks
  const { setUser,loading, setLoading } = useAuth();

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {


      const response = await axios.post("/api/auth/login", { email, password });
      if(response.data.user){
        setUser(response.data.user);
        localStorage.setItem('token',response.data.token);
      }
    
       
      setSuccess("Logged in successfully! Redirecting...");
      setEmail("");
      setPassword("");

      // Redirect to dashboard or home page after 1.5 seconds
      setTimeout(() => {
        navigate("/"); 
      }, 1500);

    } catch (err) {
      const backendMessage = err.response?.data?.message;
      setError(backendMessage || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 text-center">Sign In</h1>
          <p className="mt-2 text-sm text-gray-600 text-center">Welcome back! Please enter your details.</p>
        </div>

        {error ? (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">{error}</div>
        ) : null}
        {success ? (
          <div className="rounded-md bg-green-50 p-4 text-sm text-green-700 border border-green-200">{success}</div>
        ) : null}

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
              <input
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Password
              <input
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </label>
          </div>

          <button
            className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>

          {/* Fixed navigation loop: wrapped in inline function and added Tailwind styles */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <span 
              onClick={() => navigate('/register')} 
              className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer underline"
            >
              Create account
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
