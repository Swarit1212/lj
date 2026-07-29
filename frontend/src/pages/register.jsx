import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { toast } from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.post("/auth/register", formData);
      toast.success("Registration successful! Welcome to the atelier.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to create profile.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">
            Join the Atelier
          </span>
          <h2 className="font-heading text-3xl font-bold text-[#0B132B]">
            Create Luxury Account
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Join to start cataloging favorites, placing orders, and locking live rates.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            onChange={handleChange}
            placeholder="john@example.com"
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

          <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
            Create Profile
          </Button>
        </form>

        <div className="text-center text-xs text-neutral-500 border-t pt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-[#D4AF37] hover:underline font-bold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
