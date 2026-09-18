import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { authContext } from "../context/authContext";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { formatCurrency } from "../utils/formatCurrency";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { SkeletonProfile } from "../components/common/Skeleton";

const Profile = () => {
  const { user, login } = useContext(authContext);
  const [activeTab, setActiveTab] = useState("orders");
  
  const [name, setName] = useState(user?.name || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
    }
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const res = await API.get("/orders");
        setOrders(res.data || []);
      } catch (err) {
        console.error("Error loading user orders:", err);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await API.put("/auth/profile", { name });
      const updatedUser = { ...user, name: res.data.name || name };
      login(updatedUser);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile details.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    setIsUpdating(true);
    try {
      await API.put("/auth/change-password", {
        currentPassword,
        newPassword
      });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update password.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const base = "px-2.5 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider ";
    switch (status?.toLowerCase()) {
      case "delivered": return base + "bg-green-100 text-green-700";
      case "processing": return base + "bg-blue-100 text-blue-700";
      case "shipped": return base + "bg-amber-100 text-amber-700";
      case "cancelled": return base + "bg-red-100 text-red-700";
      default: return base + "bg-neutral-100 text-neutral-700";
    }
  };

  if (!user) {
    return <SkeletonProfile />;
  }

  return (
    <>
      <Helmet>
        <title>Your Premium Account Profile | LJ Jewelry</title>
        <meta name="description" content="Manage your premium LJ Jewelry atelier account settings, password security, and order history timeline." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#0B132B] text-white p-8 rounded-2xl border border-[#D4AF37]/30 shadow-xl mb-10 flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#B8960F] text-[#0B132B] flex items-center justify-center font-heading text-3xl font-bold border-2 border-white/20">
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold tracking-wide">{user?.name}</h2>
              <p className="text-xs text-neutral-300 font-sans mt-0.5">{user?.email}</p>
              <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-md font-bold uppercase mt-2 inline-block border border-[#D4AF37]/30">
                {user?.role || "Customer"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="space-y-2">
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full text-left px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === "orders"
                  ? "bg-[#0B132B] text-white border-l-4 border-l-[#D4AF37]"
                  : "bg-white text-neutral-600 hover:bg-neutral-50 hover:text-black border border-neutral-200"
              }`}
            >
              📋 Order History
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full text-left px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === "settings"
                  ? "bg-[#0B132B] text-white border-l-4 border-l-[#D4AF37]"
                  : "bg-white text-neutral-600 hover:bg-neutral-50 hover:text-black border border-neutral-200"
              }`}
            >
              ⚙ Profile Settings
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`w-full text-left px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === "password"
                  ? "bg-[#0B132B] text-white border-l-4 border-l-[#D4AF37]"
                  : "bg-white text-neutral-600 hover:bg-neutral-50 hover:text-black border border-neutral-200"
              }`}
            >
              🔒 Security & Password
            </button>
            <Link
              to="/custom-designs"
              className="w-full block text-left px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl bg-white text-neutral-600 hover:bg-neutral-50 hover:text-black border border-neutral-200 transition-all hover:border-[#D4AF37]/50"
            >
              ✨ Custom Designs
            </Link>
          </aside>

          <div className="lg:col-span-3">
            {activeTab === "orders" && (
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6">
                <h3 className="font-heading text-xl font-bold text-[#0B132B]">Your Placed Orders</h3>
                
                {ordersLoading ? (
                  <div className="space-y-6 divide-y divide-neutral-100">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
                        <div className="space-y-2 flex-grow">
                          <div className="h-4 bg-neutral-200 rounded w-24" />
                          <div className="h-3 bg-neutral-200 rounded w-48" />
                        </div>
                        <div className="flex gap-4 items-center w-full sm:w-auto justify-between sm:justify-end">
                          <div className="h-6 bg-neutral-200 rounded w-20" />
                          <div className="h-8 bg-neutral-200 rounded w-16" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16">
                    <span className="text-3xl">📦</span>
                    <h4 className="font-heading text-lg font-bold text-[#0B132B] mt-3">No orders found</h4>
                    <p className="text-xs text-neutral-500 mt-1 mb-6">You haven't placed any jewelry orders yet.</p>
                    <Link to="/shop">
                      <Button variant="primary">Start Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4 divide-y divide-neutral-100">
                    {orders.map((order) => (
                      <div key={order._id} className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-neutral-800">
                              #{order._id.substring(order._id.length - 8).toUpperCase()}
                            </span>
                            <span className={getStatusBadgeClass(order.orderStatus)}>
                              {order.orderStatus}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-1 font-medium">
                            Placed on: {new Date(order.createdAt).toLocaleDateString()} • {order.items?.length || 0} items
                          </p>
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                          <span className="font-heading text-lg font-bold text-[#0B132B]">
                            {formatCurrency(order.totalAmount)}
                          </span>
                          <Link to={`/orders/${order._id}`}>
                            <Button variant="outline" size="sm">
                              Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-heading text-xl font-bold text-[#0B132B] mb-6">Profile Settings</h3>
                
                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                  <Input
                    label="Full Name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                    required
                  />
                  
                  <Button type="submit" variant="primary" isLoading={isUpdating} className="w-full">
                    Save Changes
                  </Button>
                </form>
              </div>
            )}

            {activeTab === "password" && (
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-heading text-xl font-bold text-[#0B132B] mb-6">Security & Password</h3>
                
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <Input
                    label="Current Password"
                    type="password"
                    name="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <Input
                    label="New Password"
                    type="password"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  
                  <Button type="submit" variant="primary" isLoading={isUpdating} className="w-full">
                    Change Password
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;