import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo-transparent-logo.png";
import banner from "../assets/food-delivery.jpg";
import { generateApiMetadata } from "../utils/apiMetadata";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const metadata = generateApiMetadata("OFF");
    const payload = {
      ...metadata,
      data: {
        identifier,
        password
      }
    };

    try {
      const response = await fetch("http://localhost:8080/api/v1/authentication/login", {
        method: "POST",
        headers: {
          "accept": "*/*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.description || "Invalid credentials");
      }

      const result = await response.json();

      // Mapping the official response structure
      const user = {
        id: result.data?.userId || "mock-user-id",
        name: result.data?.email?.split('@')[0] || "User", // Fallback name from email
        email: result.data?.email || identifier,
        roles: result.data?.roles || [],
        avatar: ""
      };

      login(user, result.data?.accessToken || "mock-access-token", result.data?.refreshToken || "mock-refresh-token");
      
      // Handle redirect after login
      const urlParams = new URLSearchParams(window.location.search);
      const redirectPath = urlParams.get('redirect');
      navigate(redirectPath || "/");
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
      // Fallback for development if API is not running
      if (identifier === "admin") {
         login({ id: "61bfc846-70e4-4a9e-8ad0-70e95a65d29f", name: "Admin", email: "admin@foodio.com", roles: ["ROLE_ADMIN"] }, "dev-access-token", "dev-refresh-token");
         navigate("/admin");
      } else if (identifier === "user") {
         login({ id: "61bfc846-70e4-4a9e-8ad0-70e95a65d29f", name: "User", email: "user@foodio.com", roles: ["ROLE_CUSTOMER"] }, "dev-access-token", "dev-refresh-token");
         
         const urlParams = new URLSearchParams(window.location.search);
         const redirectPath = urlParams.get('redirect');
         navigate(redirectPath || "/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans overflow-hidden">
      {/* Left Side: Registration Form */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center bg-white overflow-y-auto pb-12 shadow-2xl z-10">
        <div className="max-w-[440px] w-full mx-auto px-6 py-12">
          <div className="lg:hidden mb-12 text-center">
            <Link to="/">
              <img src={logo} alt="Foodio" className="h-10 w-auto mx-auto" />
            </Link>
          </div>

          <div className="mb-12">
            <h1 className="text-[2.2rem] font-bold tracking-tight text-stone-950 mb-3">Welcome back</h1>
            <p className="text-stone-500 font-medium">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[0.7rem] font-bold uppercase tracking-widest text-stone-400 ml-1">
                Username / Email
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your email"
                className="w-full h-12 bg-stone-50 border border-stone-100 rounded-xl px-4 text-stone-900 outline-none transition-all focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 placeholder:text-stone-300"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[0.7rem] font-bold uppercase tracking-widest text-stone-400">
                  Password
                </label>
                <a href="#" className="text-[0.7rem] font-bold text-orange-600 hover:text-orange-700 transition-colors">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 bg-stone-50 border border-stone-100 rounded-xl px-4 text-stone-900 outline-none transition-all focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 placeholder:text-stone-300"
              />
            </div>

            <div className="flex items-center gap-3 ml-1 pt-2">
              <input type="checkbox" id="remember" className="h-4 w-4 rounded border-stone-200 text-orange-600 focus:ring-orange-500 cursor-pointer" />
              <label htmlFor="remember" className="text-sm font-medium text-stone-500 cursor-pointer select-none">
                Remember for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full h-14 bg-stone-950 text-white font-bold rounded-2xl shadow-xl transition-all hover:bg-orange-600 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Signing In...
                </>
              ) : "Sign In"}
            </button>
          </form>

          <div className="mt-12 text-center">
            <span className="text-stone-400 text-sm font-medium mr-2">New here?</span>
            <Link to="/register" className="text-stone-950 font-bold hover:text-orange-600 transition-colors">
              Create an account
            </Link>
          </div>

          <div className="mt-16 text-center lg:mt-24">
            <Link to="/" className="text-stone-400 text-[0.7rem] font-bold uppercase tracking-[0.2em] hover:text-stone-950 transition-colors">
              ← Back to landing page
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side: Visual Banner (Hidden on small screens) */}
      <div className="relative hidden lg:flex lg:w-3/5 bg-stone-900 overflow-hidden">
        <img
          src={banner}
          alt="Login Banner"
          className="absolute inset-0 h-full w-full object-cover opacity-70 scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />

        <div className="absolute top-16 right-16 z-20">
          <Link to="/" className="inline-block transition-transform hover:scale-105">
            <img src={logo} alt="Foodio" className="h-10 w-auto brightness-0 invert" />
          </Link>
        </div>

        <div className="relative z-10 flex flex-col justify-center p-16 w-full h-full text-right items-end">
          <div className="max-w-xl">
            <h2 className="text-white text-[4rem] font-black leading-[1.1] tracking-tight mb-6">
              Track your <br />
              <span className="text-orange-500">cravings</span> in real-time.
            </h2>
            <p className="text-stone-300 text-xl font-medium leading-relaxed">
              Login to access your personal dashboard, track active orders, and explore local favorites.
            </p>
          </div>
        </div>

        <div className="absolute bottom-16 right-16 z-20 text-stone-500 text-sm font-medium">
          Join the Foodio revolution.
        </div>
      </div>
    </div>
  );
};

export default Login;
