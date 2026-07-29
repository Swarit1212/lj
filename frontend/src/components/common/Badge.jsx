import React from "react";

export const Badge = ({
  children,
  variant = "gold",
  size = "md",
  className = "",
}) => {
  const base = "inline-flex items-center font-semibold rounded-full tracking-wider uppercase";

  const variants = {
    gold: "bg-[#D4AF37]/15 text-[#92710c] border border-[#D4AF37]/40",
    silver: "bg-slate-100 text-slate-700 border border-slate-300",
    roseGold: "bg-[#E8C5C8]/30 text-[#9E4A56] border border-[#E8C5C8]",
    navy: "bg-[#0B132B] text-white",
    success: "bg-emerald-100 text-emerald-800 border border-emerald-300",
    warning: "bg-amber-100 text-amber-800 border border-amber-300",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3.5 py-1.5 text-sm",
  };

  return (
    <span className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
