import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { authContext } from "../context/authContext";
import { formatCurrency } from "../utils/formatCurrency";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import API from "../api/axios";
import toast from "react-hot-toast";

// Utility to load external scripts dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useContext(authContext);
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("India");
  const [paymentMethod, setPaymentMethod] = useState("razorpay"); // 'razorpay' | 'cod'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const products = cart?.products || [];
  const totalPrice = cart?.totalPrice || 0;

  useEffect(() => {
    if (user?.name && !fullName) setFullName(user.name);
    if (user?.email && !email) setEmail(user.email);
  }, [user]);

  const validateForm = () => {
    if (products.length === 0) {
      setError("Your cart is empty. Add items to checkout.");
      return false;
    }
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError("Please fill in all contact information (Name, Email, and Phone).");
      return false;
    }
    if (!address.trim() || !city.trim() || !zipCode.trim() || !country.trim()) {
      setError("Please complete all shipping address fields.");
      return false;
    }
    return true;
  };

  const handleRazorpayPayment = async () => {
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      toast.error("Razorpay SDK failed to load. Check your internet connection.");
      return;
    }

    try {
      // 1. Create Razorpay order on backend
      const orderRes = await API.post("/orders/razorpay/create-order");
      const { order, keyId, isLiveConfigured } = orderRes.data;

      if (!order || !order.id) {
        throw new Error("Unable to create payment order.");
      }

      const shippingData = {
        name: fullName,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        country,
      };

      // 2. Configure Razorpay modal options
      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "LJ Jewelry Atelier",
        description: "Fine Jewelry Acquisition",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=120&q=80",
        order_id: isLiveConfigured ? order.id : undefined,
        prefill: {
          name: fullName,
          email: email,
          contact: phone,
        },
        theme: {
          color: "#0B132B",
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
            toast("Payment window closed.", { icon: "ℹ️" });
          },
        },
        handler: async (response) => {
          try {
            // 3. Verify payment signature on backend
            const verifyRes = await API.post("/orders/razorpay/verify-payment", {
              razorpayOrderId: response.razorpay_order_id || order.id,
              razorpayPaymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
              razorpaySignature: response.razorpay_signature || "simulated_signature",
              shippingAddress: shippingData,
            });

            if (verifyRes.data.success) {
              await clearCart();
              toast.success("Payment successful! Order confirmed.");
              navigate("/order-confirmation", {
                state: { orderId: verifyRes.data.order._id },
              });
            }
          } catch (err) {
            console.error("Verification error:", err);
            toast.error(
              err.response?.data?.message || "Payment verification failed. Contact support."
            );
          } finally {
            setIsSubmitting(false);
          }
        },
      };

      if (!isLiveConfigured) {
        // Safe mock mode handler if no live keys
        toast("Running in test payment mode", { icon: "🧪" });
        setTimeout(async () => {
          try {
            const verifyRes = await API.post("/orders/razorpay/verify-payment", {
              razorpayOrderId: order.id,
              razorpayPaymentId: `pay_mock_${Date.now()}`,
              razorpaySignature: "mock_signature",
              shippingAddress: shippingData,
            });
            if (verifyRes.data.success) {
              await clearCart();
              toast.success("Test order confirmed!");
              navigate("/order-confirmation", {
                state: { orderId: verifyRes.data.order._id },
              });
            }
          } catch (err) {
            toast.error(err.response?.data?.message || "Order placement failed.");
          } finally {
            setIsSubmitting(false);
          }
        }, 800);
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        setIsSubmitting(false);
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setError(err.response?.data?.message || "Failed to initialize payment gateway.");
    }
  };

  const handleCodOrder = async () => {
    try {
      const shippingData = {
        name: fullName,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        country,
      };

      const res = await API.post("/orders", {
        shippingAddress: shippingData,
        paymentMethod: "cod",
      });

      if (res.data) {
        await clearCart();
        toast.success("Order placed successfully with Cash on Delivery!");
        navigate("/order-confirmation", { state: { orderId: res.data._id } });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to place order. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    if (paymentMethod === "razorpay") {
      await handleRazorpayPayment();
    } else {
      await handleCodOrder();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-[#0B132B]">Secure Checkout</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Complete your acquisition with 256-bit encrypted checkout and insured express delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Shipping Details */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="font-heading text-xl font-bold text-[#0B132B] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0B132B] text-[#D4AF37] text-xs flex items-center justify-center font-mono">1</span>
              Customer & Shipping Details
            </h2>

            <form onSubmit={handleCheckoutSubmit} id="checkout-form" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Eleanor Vance"
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="eleanor@luxury.com"
                  required
                />
              </div>

              <Input
                label="Phone Number (for Courier & OTP)"
                type="tel"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                required
              />

              <Input
                label="Street Address / Residence"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Flat 4B, Royale Crest, 12th Avenue"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="City"
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Mumbai"
                  required
                />
                <Input
                  label="State / Region"
                  name="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Maharashtra"
                  required
                />
                <Input
                  label="PIN / Postal Code"
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
            </form>
          </div>

          {/* Payment Selection */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="font-heading text-xl font-bold text-[#0B132B] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0B132B] text-[#D4AF37] text-xs flex items-center justify-center font-mono">2</span>
              Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Razorpay Option */}
              <div
                onClick={() => setPaymentMethod("razorpay")}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === "razorpay"
                    ? "border-[#D4AF37] bg-[#D4AF37]/5 shadow-sm"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#0B132B] flex items-center gap-1.5">
                      Online Gateway (Razorpay)
                      <span className="bg-[#D4AF37]/20 text-[#0B132B] text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Instant</span>
                    </span>
                    <p className="text-[11px] text-neutral-500 mt-1">
                      UPI, Credit/Debit Cards, NetBanking, and Wallets with 256-bit encryption.
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      paymentMethod === "razorpay"
                        ? "border-[#D4AF37] bg-[#0B132B]"
                        : "border-neutral-300"
                    }`}
                  >
                    {paymentMethod === "razorpay" && (
                      <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                    )}
                  </div>
                </div>
              </div>

              {/* COD Option */}
              <div
                onClick={() => setPaymentMethod("cod")}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === "cod"
                    ? "border-[#D4AF37] bg-[#D4AF37]/5 shadow-sm"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#0B132B] block">Cash on Delivery</span>
                    <p className="text-[11px] text-neutral-500 mt-1">
                      Pay upon delivery with cash or mobile UPI with our insured courier.
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      paymentMethod === "cod"
                        ? "border-[#D4AF37] bg-[#0B132B]"
                        : "border-neutral-300"
                    }`}
                  >
                    {paymentMethod === "cod" && (
                      <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold">
                {error}
              </div>
            )}

            <Button
              type="submit"
              form="checkout-form"
              variant="primary"
              size="lg"
              className="w-full mt-4"
              isLoading={isSubmitting}
            >
              {paymentMethod === "razorpay"
                ? `Pay ${formatCurrency(totalPrice)} via Gateway`
                : `Confirm Order with Cash on Delivery`}
            </Button>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6 sticky top-24">
          <h2 className="font-heading text-xl font-bold text-[#0B132B] border-b border-neutral-100 pb-4">
            Order Summary
          </h2>

          <div className="space-y-4 divide-y divide-neutral-100 max-h-72 overflow-y-auto pr-1">
            {products.map((item) => {
              const prod = item.product || {};
              return (
                <div key={item._id} className="pt-3 first:pt-0 flex gap-3 items-center">
                  <img
                    src={
                      prod.imageUrl ||
                      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=150&q=80"
                    }
                    alt={prod.name}
                    className="w-12 h-12 object-cover rounded-lg border border-neutral-200"
                  />
                  <div className="flex-1 text-xs">
                    <h4 className="font-heading font-bold text-[#0B132B] line-clamp-1">
                      {prod.name}
                    </h4>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      Qty: {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-neutral-800">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-neutral-100 pt-4 space-y-2 text-xs">
            <div className="flex justify-between items-center text-neutral-500">
              <span>Items Total</span>
              <span className="font-semibold text-neutral-800">{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between items-center text-neutral-500">
              <span>Insured White-Glove Delivery</span>
              <span className="text-emerald-600 font-bold tracking-wider uppercase text-[10px]">
                Complimentary
              </span>
            </div>
            <div className="flex justify-between items-center text-neutral-500">
              <span>GST (3% applicable)</span>
              <span className="font-semibold text-neutral-800">Included in Price</span>
            </div>

            <div className="border-t border-neutral-100 pt-4 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-[#0B132B] block">Total Payable</span>
                <span className="text-[10px] text-neutral-400">All taxes included</span>
              </div>
              <span className="font-heading text-xl font-bold text-[#0B132B]">
                {formatCurrency(totalPrice)}
              </span>
            </div>
          </div>

          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center gap-2.5 text-[11px] text-neutral-600">
            <span className="text-base">🛡️</span>
            <span>100% BIS Hallmarked Pure Metals & Certified Gemstones Guaranteed.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
