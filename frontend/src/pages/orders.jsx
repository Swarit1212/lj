import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { formatCurrency } from "../utils/formatCurrency";
import Button from "../components/common/Button";
import { Helmet } from "react-helmet-async";
import { SkeletonOrders } from "../components/common/Skeleton";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch order history details. Please try reloading.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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

  if (loading) {
    return <SkeletonOrders />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <span className="text-4xl">📦</span>
        <h2 className="font-heading text-2xl font-bold text-red-500">Order timeline sync failed</h2>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">{error}</p>
        <div className="flex justify-center gap-4">
          <Button variant="primary" onClick={fetchOrders}>Retry Sync</Button>
          <Link to="/profile"><Button variant="outline">Back to Account</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Your Order History | LJ Jewelry</title>
        <meta name="description" content="Review all your past and current jewelry order statuses, invoices, and delivery details." />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-3xl font-bold text-[#0B132B]">Order History</h1>
          <Link to="/profile">
            <Button variant="ghost" size="sm">Back to Account</Button>
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white border border-neutral-200 rounded-2xl shadow-sm">
            <span className="text-4xl">📦</span>
            <h3 className="font-heading text-xl font-bold text-[#0B132B] mt-4">No Orders Placed</h3>
            <p className="text-xs text-neutral-500 mt-2 mb-6">You have not completed any jewelry purchases yet.</p>
            <Link to="/shop">
              <Button variant="primary">Shop Collection</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-neutral-800">
                      #{order._id.substring(order._id.length - 8).toUpperCase()}
                    </span>
                    <span className={getStatusBadgeClass(order.orderStatus)}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 font-medium">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    {order.items?.map((item, idx) => (
                      <span key={idx} className="inline-block w-8 h-8 rounded bg-neutral-100 border border-neutral-200 overflow-hidden">
                        <img src={item.product?.imageUrl || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=50&q=80"} alt="" className="w-full h-full object-cover" />
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 border-t pt-4 sm:border-0 sm:pt-0">
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-medium">Total Price</span>
                    <span className="font-heading text-lg font-bold text-[#0B132B]">{formatCurrency(order.totalAmount)}</span>
                  </div>
                  <Link to={`/orders/${order._id}`}>
                    <Button variant="outline" size="sm">View Order</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;
