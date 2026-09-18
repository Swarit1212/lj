import React, { useContext } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { authContext } from "../context/authContext.jsx";
import Button from "./common/Button";

const AdminLayout = () => {
  const { user, logout } = useContext(authContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { name: "📈 Overview Dashboard", path: "/admin" },
    { name: "💎 Catalog Products", path: "/admin/products" },
    { name: "📦 Order Fulfillment", path: "/admin/orders" },
    { name: "🛠 Custom Orders", path: "/admin/custom-orders" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0B132B] text-white flex flex-col border-r border-[#D4AF37]/20">
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-[#D4AF37]/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#AA7C11] text-[#0B132B] flex items-center justify-center font-heading text-base font-extrabold shadow-md">
            LJ
          </div>
          <div>
            <h2 className="font-heading text-sm font-bold tracking-wider leading-none text-white">LJ JEWELERS</h2>
            <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold mt-1 block">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Sidebar Menu Options */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? "bg-[#D4AF37] text-[#0B132B] shadow-lg shadow-[#D4AF37]/10 font-extrabold"
                    : "text-neutral-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer (User session details + Actions) */}
        <div className="p-4 border-t border-[#D4AF37]/10 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2 px-2">
            <div className="text-left overflow-hidden">
              <span className="text-[9px] text-neutral-400 block uppercase font-bold tracking-wider">Operator</span>
              <span className="text-xs font-bold text-neutral-200 block truncate max-w-[140px]">{user?.name}</span>
            </div>
            <Link to="/" className="text-[#D4AF37] hover:underline text-[10px] font-bold uppercase tracking-wider">
              Shop Store →
            </Link>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout} 
            className="w-full !border-red-500/30 !text-red-400 hover:!bg-red-500 hover:!text-white hover:!border-red-500 text-xs py-2 rounded-xl transition-all duration-200"
          >
            Logout Portal
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
