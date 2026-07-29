import React from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "../components/common/Button";

const OrderConfirmation = () => {
  const location = useLocation();
  const orderId = location.state?.orderId || "UNKNOWN";

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl mx-auto border-2 border-emerald-300 animate-bounce">
        ✓
      </div>
      
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold block">Order Confirmed</span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#0B132B]">Thank you for your purchase</h1>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
          Your order has been logged and is currently being prepared for shipping under certified insured protocol.
        </p>
      </div>

      <div className="bg-[#FAFAFA] border border-neutral-200 rounded-xl p-4 max-w-md mx-auto">
        <span className="text-[10px] text-neutral-400 block uppercase font-bold tracking-wider">Order ID</span>
        <span className="font-mono text-sm font-bold text-neutral-800">{orderId}</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
        <Link to={`/orders/${orderId}`}>
          <Button variant="primary">Track Order</Button>
        </Link>
        <Link to="/">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
