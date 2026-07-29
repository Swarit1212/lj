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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#D4AF37]/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0B132B] to-[#1A264D] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] font-heading text-xl font-bold group-hover:scale-105 transition-transform">
            LJ
          </div>
          <div>
            <span className="font-heading text-2xl font-bold tracking-wider text-[#0B132B] block leading-none">
              LJ JEWELRY
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold block mt-0.5">
              LUXURY & ATELIER
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          <Link
            to="/"
            className="text-neutral-700 hover:text-[#D4AF37] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#D4AF37] hover:after:w-full after:transition-all after:duration-300"
          >
            HOME
          </Link>
          <Link
            to="/shop"
            className="text-neutral-700 hover:text-[#D4AF37] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#D4AF37] hover:after:w-full after:transition-all after:duration-300"
          >
            COLLECTIONS
          </Link>
          <Link
            to="/shop?material=gold"
            className="text-neutral-700 hover:text-[#D4AF37] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#D4AF37] hover:after:w-full after:transition-all after:duration-300"
          >
            GOLD
          </Link>
          <Link
            to="/shop?material=silver"
            className="text-neutral-700 hover:text-[#D4AF37] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#D4AF37] hover:after:w-full after:transition-all after:duration-300"
          >
            SILVER
          </Link>
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
        </div>
      )}
    </header>
  );
};

export default Navbar;
