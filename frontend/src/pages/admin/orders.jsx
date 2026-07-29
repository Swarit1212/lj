import React, { useState, useEffect } from "react";
import API from "../../api/axios.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import Button from "../../components/common/Button.jsx";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = statusFilter
        ? `/orders/admin/all?status=${statusFilter}&limit=100`
        : "/orders/admin/all?limit=100";
      const res = await API.get(url);
      setOrders(res.data?.orders || res.data || []);
    } catch (err) {
      console.error("Error loading admin orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { orderStatus: status });
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to update order status.");
    }
  };

  const handleUpdatePayment = async (id, payment) => {
    try {
      await API.put(`/orders/${id}/status`, { paymentStatus: payment });
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to update payment status.");
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-2.5 py-1 text-[9px] font-extrabold uppercase rounded-full tracking-wider ";
    switch (status?.toLowerCase()) {
      case "delivered": return base + "bg-green-50 text-green-700 border border-green-200";
      case "processing": return base + "bg-blue-50 text-blue-700 border border-blue-200";
      case "shipped": return base + "bg-amber-50 text-amber-700 border border-amber-200";
      case "cancelled": return base + "bg-red-50 text-red-700 border border-red-200";
      default: return base + "bg-neutral-50 text-neutral-600 border border-neutral-200";
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Title Header */}
      <div>
        <h1 className="font-heading text-3xl font-extrabold text-[#0B132B] tracking-tight">Fulfillment Registry</h1>
        <p className="text-xs text-neutral-500 mt-1.5 font-medium uppercase tracking-wider">
          Track payments, update dispatch shipping statuses, and manage user order logs.
        </p>
      </div>

      {/* Filter Control bar */}
      <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-xs text-xs max-w-sm">
        <label className="font-bold text-neutral-500 pl-1 uppercase tracking-wider text-[10px]">Filter Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex-1 bg-neutral-50 border border-neutral-300 rounded-xl p-2 font-bold focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-[#0B132B] transition-all duration-200"
        >
          <option value="">All Orders</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="py-20 text-center animate-pulse text-neutral-400 font-bold uppercase tracking-wider text-xs">
          Loading Registry Ledger...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white border rounded-2xl text-neutral-400 font-bold uppercase tracking-wider text-xs">
          No matching order logs found.
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/50 text-neutral-500 font-extrabold uppercase tracking-wider">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-center">Payment Info</th>
                  <th className="p-4 text-center">Fulfillment</th>
                  <th className="p-4 text-right">Invoice Value</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-neutral-50/30 transition-colors">
                    {/* Order ID */}
                    <td className="p-4 font-mono font-bold text-neutral-800">
                      #{ord._id.substring(ord._id.length - 8).toUpperCase()}
                    </td>
                    
                    {/* Customer */}
                    <td className="p-4">
                      <span className="font-bold text-[#0B132B] block">{ord.user?.name || "Guest User"}</span>
                      <span className="text-[10px] text-neutral-400 font-medium block">{ord.user?.email}</span>
                    </td>
                    
                    {/* Date */}
                    <td className="p-4 font-medium text-neutral-500">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    
                    {/* Payment Info */}
                    <td className="p-4 text-center">
                      <select
                        value={ord.paymentStatus}
                        onChange={(e) => handleUpdatePayment(ord._id, e.target.value)}
                        className={`font-bold bg-neutral-50 border rounded-xl px-2 py-1.5 text-[10px] uppercase focus:outline-none transition-all duration-200 ${
                          ord.paymentStatus === "paid" 
                            ? "text-emerald-700 border-emerald-200 hover:bg-emerald-100/30" 
                            : "text-amber-700 border-amber-200 hover:bg-amber-100/30"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                      </select>
                    </td>
                    
                    {/* Fulfillment Status */}
                    <td className="p-4 text-center">
                      <span className={getStatusBadge(ord.orderStatus)}>
                        {ord.orderStatus}
                      </span>
                    </td>
                    
                    {/* Invoice Value */}
                    <td className="p-4 text-right font-black text-[#0B132B]">
                      {formatCurrency(ord.totalAmount)}
                    </td>
                    
                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="inline-flex gap-2">
                        {ord.orderStatus !== "delivered" && ord.orderStatus !== "cancelled" && (
                          <>
                            {ord.orderStatus !== "shipped" && (
                              <button
                                onClick={() => handleUpdateStatus(ord._id, "shipped")}
                                className="bg-[#D4AF37] hover:bg-[#AA7C11] text-[#0B132B] px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider text-[9px] transition-all duration-200 hover:shadow-xs active:translate-y-0.5"
                              >
                                Dispatch
                              </button>
                            )}
                            <button
                              onClick={() => handleUpdateStatus(ord._id, "delivered")}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider text-[9px] transition-all duration-200 hover:shadow-xs active:translate-y-0.5"
                            >
                              Deliver
                            </button>
                          </>
                        )}
                        {ord.orderStatus !== "cancelled" && ord.orderStatus !== "delivered" && (
                          <button
                            onClick={() => handleUpdateStatus(ord._id, "cancelled")}
                            className="bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider text-[9px] transition-all duration-200"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
