import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authContext } from "../context/authContext";
import API from "../api/axios.js";
import { GoogleLogin } from "@react-oauth/google";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { toast } from "react-hot-toast";

const Login = () => {
  const { login } = useContext(authContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", { email, password });
      login(data);
      toast.success(`Welcome back, ${data.name || "Atelier Member"}!`);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Invalid email or password.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setError("");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/google", {
        token: credentialResponse.credential,
      });
      login(data);
      toast.success(`Welcome back, ${data.name || "Atelier Member"}!`);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError("Google authentication failed.");
      toast.error("Google authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">
            Welcome Back
          </span>
          <h2 className="font-heading text-3xl font-bold text-[#0B132B]">
            Sign In to LJ Jewelry
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Access your secure profile, orders history, and saved billing settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yourname@example.com"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

          <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
            Sign In
          </Button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-neutral-200"></div>
          <span className="flex-shrink mx-4 text-neutral-400 text-[10px] uppercase font-bold tracking-widest">Or login with</span>
          <div className="flex-grow border-t border-neutral-200"></div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setError("Google login failed")}
            useOneTap
          />
        </div>

        <div className="text-center text-xs text-neutral-500 border-t pt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#D4AF37] hover:underline font-bold">
            Create Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
