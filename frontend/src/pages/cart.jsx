import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatCurrency";
import Button from "../components/common/Button";
import API from "../api/axios";
import { Helmet } from "react-helmet-async";
import { SkeletonCart } from "../components/common/Skeleton";

const Cart = () => {
  const { cart, removeFromCart, clearCart, refreshCart, isLoading } = useCart();
  const navigate = useNavigate();

  const products = cart?.products || [];
  const totalPrice = cart?.totalPrice || 0;

  const handleQtyChange = async (productId, currentQty, delta) => {
    const nextQty = currentQty + delta;
    if (nextQty < 1) return;
    try {
      await API.put(`/cart/${productId}`, { quantity: nextQty });
      refreshCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  if (isLoading && products.length === 0) {
    return <SkeletonCart />;
  }

  return (
    <>
      <Helmet>
        <title>Your Shopping Bag | LJ Jewelry</title>
        <meta name="description" content="View the luxury jewelry masterpieces inside your shopping bag and proceed to secure checkout." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-heading text-3xl font-bold text-[#0B132B] mb-8">Shopping Bag</h1>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white border border-neutral-200 rounded-2xl shadow-sm">
          <span className="text-5xl">💎</span>
          <h2 className="font-heading text-2xl font-bold text-[#0B132B] mt-6">Your shopping bag is empty</h2>
          <p className="text-xs text-neutral-500 mt-2 mb-8 max-w-sm mx-auto">
            Discover our fine craftsmanship collections of gold rings, diamond necklaces, and solid sterling silver cuffs.
          </p>
          <Link to="/shop">
            <Button variant="primary">Explore Royal Catalog</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gold-500/10 rounded-2xl p-6 shadow-xs overflow-hidden">
              <div className="divide-y divide-neutral-100/70">
                {products.map((item) => {
                  const prod = item.product || {};
                  return (
                    <div key={item._id || prod._id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                      <div className="flex gap-4 items-center">
                        <img
                          src={prod.imageUrl || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=200&q=80"}
                          alt={prod.name}
                          className="w-20 h-20 object-cover rounded-xl border border-gold-500/10 shadow-xs bg-[#FAF9F6]"
                        />
                        <div>
                          <h3 className="font-heading text-base font-bold text-royal-navy hover:text-gold-500 transition-colors">
                            <Link to={`/product/${prod._id}`}>{prod.name}</Link>
                          </h3>
                          <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest mt-1.5">
                            {prod.material} • {prod.karat?.toUpperCase()} • {prod.weight}g
                          </p>
                          <button
                            onClick={() => removeFromCart(prod._id || item._id)}
                            className="text-red-500 hover:text-red-700 text-[10px] font-bold uppercase tracking-wider mt-2.5 block cursor-pointer transition-colors"
                          >
                            Remove Item
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-8 justify-between w-full sm:w-auto">
                        <div className="flex items-center border border-neutral-200 rounded-lg bg-neutral-50/50 overflow-hidden shadow-xs font-sans">
                          <button
                            onClick={() => handleQtyChange(prod._id, item.quantity, -1)}
                            className="px-3 py-1.5 hover:bg-neutral-100 text-xs font-bold text-neutral-600 transition-colors cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-4 py-1.5 text-xs font-bold text-royal-navy">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQtyChange(prod._id, item.quantity, 1)}
                            className="px-3 py-1.5 hover:bg-neutral-100 text-xs font-bold text-neutral-600 transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="font-heading text-lg font-semibold text-royal-navy block">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                          <span className="text-[9px] text-neutral-400 block font-bold uppercase tracking-wider mt-0.5">
                            {formatCurrency(item.price)} each
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Link to="/shop">
                <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-black font-bold text-[10px] tracking-widest rounded-lg">
                  ← CONTINUE SHOPPING
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={clearCart} className="!text-[10px] font-bold tracking-widest px-4 py-2.5 rounded-lg hover:shadow-xs active:scale-[0.98]">
                CLEAR SHOPPING BAG
              </Button>
            </div>
          </div>

          <div className="bg-white border border-gold-500/10 rounded-2xl p-6 shadow-md hover:border-gold-500/30 transition-all duration-300 space-y-6 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-gold-500/5 blur-2xl" />
            <h2 className="font-heading text-xl font-bold text-royal-navy border-b border-neutral-100 pb-4 relative z-10">Order Summary</h2>
            
            <div className="space-y-4 text-xs relative z-10 text-neutral-500 font-sans">
              <div className="flex justify-between items-center">
                <span>Subtotal ({products.length} Items)</span>
                <span className="font-semibold text-royal-navy">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Fully Insured Shipping</span>
                <span className="text-emerald-600 font-bold uppercase tracking-wider text-[10px]">FREE</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Estimated Taxes</span>
                <span className="font-semibold text-royal-navy">3% GST Included</span>
              </div>
              
              <div className="border-t border-neutral-100 pt-4 flex justify-between items-center text-sm font-bold">
                <span className="text-gold-500 text-[10px] uppercase tracking-widest">Total Valuation</span>
                <span className="font-heading text-xl text-royal-navy">{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full mt-4 !py-3.5 !text-[11px] font-bold tracking-widest uppercase rounded-xl shadow-lg shadow-gold-500/10 relative z-10"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Secure Checkout
            </Button>
            
            <div className="text-center relative z-10">
              <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest">🔒 256-Bit SSL Encrypted Connection</span>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Cart;
