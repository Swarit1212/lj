import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatCurrency";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import API from "../api/axios";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("India");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const products = cart?.products || [];
  const totalPrice = cart?.totalPrice || 0;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (products.length === 0) {
      setError("Your cart is empty. Add items to checkout.");
      return;
    }

    if (!address || !city || !zipCode || !country) {
      setError("Please complete all shipping address fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await API.post("/orders", {
        shippingAddress: { address, city, zipCode, country }
      });
      if (res.data) {
        await clearCart();
        navigate("/order-confirmation", { state: { orderId: res.data._id } });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to place order. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-heading text-3xl font-bold text-[#0B132B] mb-8">Secure Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="font-heading text-xl font-bold text-[#0B132B]">Shipping Information</h2>
          
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <Input
              label="Street Address"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Luxury Lane, Flat 4B"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Mumbai"
                required
              />
              <Input
                label="ZIP / Postal Code"
                name="zipCode"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="400001"
                required
              />
            </div>
            <Input
              label="Country"
              name="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="India"
              required
            />

            <div className="mt-8 pt-6 border-t border-neutral-200 space-y-4">
              <h3 className="font-heading text-lg font-bold text-[#0B132B]">Payment Option</h3>
              <div className="p-4 border-2 border-[#D4AF37] bg-[#D4AF37]/5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#0B132B] block">Cash on Delivery (COD)</span>
                  <span className="text-[10px] text-neutral-500">Pay in cash or UPI at your doorstep upon secure delivery.</span>
                </div>
                <div className="w-5 h-5 rounded-full border-4 border-[#D4AF37] bg-white flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                </div>
              </div>
            </div>

            {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-6"
              isLoading={isSubmitting}
            >
              Confirm and Place Order
            </Button>
          </form>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="font-heading text-xl font-bold text-[#0B132B] border-b pb-4">Bag Summary</h2>
          
          <div className="space-y-4 divide-y divide-neutral-100 max-h-80 overflow-y-auto pr-2">
            {products.map((item) => {
              const prod = item.product || {};
              return (
                <div key={item._id} className="pt-3 first:pt-0 flex gap-3 items-center">
                  <img
                    src={prod.imageUrl || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=150&q=80"}
                    alt={prod.name}
                    className="w-12 h-12 object-cover rounded-lg border border-neutral-200"
                  />
                  <div className="flex-1 text-xs">
                    <h4 className="font-heading font-bold text-[#0B132B] line-clamp-1">{prod.name}</h4>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                  </div>
                  <span className="text-xs font-bold text-neutral-800">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-4 space-y-2 text-xs">
            <div className="flex justify-between items-center text-neutral-500">
              <span>Subtotal</span>
              <span className="font-semibold text-neutral-800">{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between items-center text-neutral-500">
              <span>Insured Shipping</span>
              <span className="text-emerald-600 font-bold">FREE</span>
            </div>
            <div className="flex justify-between items-center text-neutral-500">
              <span>Taxes (included)</span>
              <span className="font-semibold text-neutral-800">3% GST Included</span>
            </div>
            
            <div className="border-t pt-4 flex justify-between items-center text-sm font-bold text-[#0B132B]">
              <span>Final Amount</span>
              <span className="font-heading text-lg text-[#0B132B]">{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
