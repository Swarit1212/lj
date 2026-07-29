import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import { formatCurrency } from "../utils/formatCurrency";
import Button from "../components/common/Button";
import { Helmet } from "react-helmet-async";
import { SkeletonOrderDetail } from "../components/common/Skeleton";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("Failed to retrieve order details. Please verify authorization.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) {
    return <SkeletonOrderDetail />;
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6 animate-fadeIn">
        <span className="text-4xl">📜</span>
        <h2 className="font-heading text-2xl font-bold text-red-500">Order details load failed</h2>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">{error}</p>
        <div className="flex justify-center gap-4">
          <Button variant="primary" onClick={fetchOrder}>Retry loading</Button>
          <Link to="/orders"><Button variant="outline">View All Orders</Button></Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <h2 className="font-heading text-2xl font-bold text-[#0B132B]">Order Not Found</h2>
        <Link to="/orders">
          <Button variant="primary">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const steps = ["processing", "shipped", "delivered"];
  const currentStepIdx = steps.indexOf(order.orderStatus?.toLowerCase());

  return (
    <>
      <Helmet>
        <title>{`Order Details #${order._id.substring(order._id.length - 8).toUpperCase()} | LJ Jewelry`}</title>
        <meta name="description" content="View shipping tracking, payment options, and item valuation inside your luxury order invoice." />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#0B132B]">Order Details</h1>
            <p className="text-[10px] text-neutral-400 mt-1">ID: #{order._id.toUpperCase()} • Placed: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <Link to="/orders">
            <Button variant="ghost" size="sm">← All Orders</Button>
          </Link>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between max-w-xl mx-auto relative">
            {steps.map((step, idx) => {
              const isActive = idx <= currentStepIdx;
              return (
                <div key={step} className="flex flex-col items-center z-10 flex-1 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    isActive ? "bg-[#D4AF37] border-[#D4AF37] text-white" : "bg-white border-neutral-200 text-neutral-400"
                  }`}>
                    {idx + 1}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider mt-2 text-neutral-700 capitalize">{step}</span>
                </div>
              );
            })}
            <div className="absolute top-4 left-10 right-10 h-[2px] bg-neutral-200 -z-0">
              <div
                className="h-full bg-[#D4AF37] transition-all"
                style={{ width: `${(Math.max(0, currentStepIdx) / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading text-lg font-bold text-[#0B132B]">Items in Order</h2>
            <div className="divide-y divide-neutral-100">
              {order.items?.map((item) => {
                const prod = item.product || {};
                return (
                  <div key={item._id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex gap-3 items-center">
                      <img
                        src={prod.imageUrl || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=150&q=80"}
                        alt={prod.name}
                        className="w-12 h-12 object-cover rounded-lg border border-neutral-200"
                      />
                      <div>
                        <h4 className="font-heading text-sm font-bold text-[#0B132B] hover:text-[#D4AF37]"><Link to={`/product/${prod._id}`}>{prod.name}</Link></h4>
                        <p className="text-[10px] text-neutral-400 font-semibold uppercase">{prod.material} • Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-neutral-800">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-4">
              <h2 className="font-heading text-lg font-bold text-[#0B132B]">Delivery Address</h2>
              <div className="text-xs text-neutral-600 space-y-1">
                <p className="font-semibold text-neutral-800">{order.shippingAddress?.address}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.zipCode}</p>
                <p>{order.shippingAddress?.country}</p>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-4">
              <h2 className="font-heading text-lg font-bold text-[#0B132B]">Summary</h2>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Payment Mode:</span>
                  <span className="font-semibold text-neutral-800 uppercase">Cash on Delivery</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Payment Status:</span>
                  <span className="font-bold text-amber-600 uppercase">{order.paymentStatus}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-sm text-[#0B132B]">
                  <span>Total Value</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
