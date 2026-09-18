import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authContext } from "../../context/authContext";
import { useCart } from "../../context/CartContext";
import Button from "../common/Button";

export const Navbar = () => {
  const { user, logout } = useContext(authContext);
  const { cart, setIsDrawerOpen } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = Array.isArray(cart?.products)
    ? cart.products.reduce((sum, item) => sum + (item?.quantity || 1), 0)
    : 0;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-gold-500/15 shadow-xs transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#050B1A] to-[#121E3D] border border-gold-500/40 flex items-center justify-center text-gold-500 font-heading text-xl font-bold shadow-md shadow-gold-500/5 group-hover:scale-105 group-hover:border-gold-500 transition-all duration-300">
            LJ
          </div>
          <div>
            <span className="font-heading text-2xl font-bold tracking-widest text-royal-navy block leading-none transition-colors group-hover:text-gold-500">
              LJ JEWELRY
            </span>
            <span className="text-[9px] uppercase tracking-widest text-gold-500 font-bold block mt-0.5">
              LUXURY & ATELIER
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold tracking-widest">
          {[
            { label: "HOME", path: "/" },
            { label: "COLLECTIONS", path: "/shop" },
            { label: "GOLD", path: "/shop?material=gold" },
            { label: "SILVER", path: "/shop?material=silver" },
            { label: "CUSTOM DESIGN", path: "/custom-designs" },
            { label: "CALCULATOR", path: "/price-calculator" },
            { label: "SIZE FINDER", path: "/size-finder" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="text-neutral-600 hover:text-gold-500 transition-colors relative py-1.5 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[1.5px] after:bg-gold-500 hover:after:w-full after:transition-all after:duration-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Actions & Cart */}
        <div className="flex items-center gap-4">
          {/* Cart Trigger */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="relative p-2.5 text-neutral-700 hover:text-[#D4AF37] transition-colors rounded-full hover:bg-neutral-100"
            aria-label="Open Cart"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#D4AF37] to-[#B8960F] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account / Profile */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="hidden sm:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-700 hover:text-[#D4AF37] transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-[#D4AF37]/15 text-[#92710c] flex items-center justify-center font-bold">
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </span>
                <span className="hidden lg:inline">{user.name || "My Account"}</span>
              </Link>
              {user.role === "admin" && (
                <Link to="/admin">
                  <Button variant="outline" size="sm">
                    Admin
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register" className="hidden sm:inline-block">
                <Button variant="primary" size="sm">
                  Register
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-700 hover:text-[#D4AF37]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-neutral-800"
          >
            HOME
          </Link>
          <Link
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-neutral-800"
          >
            COLLECTIONS
          </Link>
          <Link
            to="/shop?material=gold"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-neutral-800"
          >
            GOLD JEWELRY
          </Link>
          <Link
            to="/shop?material=silver"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-neutral-800"
          >
            SILVER JEWELRY
          </Link>
          <Link
            to="/custom-designs"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-neutral-800"
          >
            CUSTOM DESIGN
          </Link>
          <Link
            to="/price-calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-neutral-800"
          >
            PRICING CALCULATOR
          </Link>
          <Link
            to="/size-finder"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-neutral-800"
          >
            SIZE FINDER
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
