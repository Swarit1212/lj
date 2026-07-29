import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | LJ Jewelry</title>
        <meta name="description" content="The page you are looking for does not exist or has been removed." />
      </Helmet>
      <div className="min-h-[65vh] bg-[#FAFAFA] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl border border-[#D4AF37]/20 shadow-xl space-y-6">
          <div className="text-6xl animate-pulse">💎</div>
          <h1 className="font-heading text-5xl font-bold text-[#0B132B] tracking-tight">404</h1>
          <h2 className="font-heading text-xl font-bold text-[#0B132B] uppercase tracking-wide">
            Masterpiece Not Found
          </h2>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
            The page or product catalogue item you are seeking does not exist. It may have been archived or moved to another atelier.
          </p>
          <div className="pt-2">
            <Link to="/" className="block">
              <Button variant="primary" className="w-full">
                Return to Grand Storefront
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
