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
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm overflow-hidden">
              <div className="divide-y divide-neutral-100">
                {products.map((item) => {
                  const prod = item.product || {};
                  return (
                    <div key={item._id || prod._id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                      <div className="flex gap-4 items-center">
                        <img
                          src={prod.imageUrl || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=200&q=80"}
                          alt={prod.name}
                          className="w-20 h-20 object-cover rounded-xl border border-neutral-200"
                        />
                        <div>
                          <h3 className="font-heading text-base font-bold text-[#0B132B] hover:text-[#D4AF37] transition-colors">
                            <Link to={`/product/${prod._id}`}>{prod.name}</Link>
                          </h3>
                          <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider mt-1">
                            {prod.material} • {prod.karat?.toUpperCase()} • {prod.weight}g
                          </p>
                          <button
                            onClick={() => removeFromCart(prod._id || item._id)}
                            className="text-red-500 hover:text-red-700 text-xs font-semibold mt-2 block"
                          >
                            Remove Item
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-8 justify-between w-full sm:w-auto">
                        <div className="flex items-center border border-neutral-200 rounded-lg bg-neutral-50 overflow-hidden shadow-xs">
                          <button
                            onClick={() => handleQtyChange(prod._id, item.quantity, -1)}
                            className="px-3 py-1.5 hover:bg-neutral-200 text-sm font-bold text-[#0B132B] transition-colors"
                          >
                            -
                          </button>
                          <span className="px-4 py-1.5 text-xs font-bold text-neutral-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQtyChange(prod._id, item.quantity, 1)}
                            className="px-3 py-1.5 hover:bg-neutral-200 text-sm font-bold text-[#0B132B] transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="font-heading text-lg font-bold text-[#0B132B] block">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                          <span className="text-[10px] text-neutral-400 block font-medium">
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
                <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-black">
                  ← Continue Shopping
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={clearCart} className="text-xs">
                Clear Shopping Bag
              </Button>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="font-heading text-xl font-bold text-[#0B132B] border-b pb-4">Order Summary</h2>
            
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center text-neutral-600">
                <span>Subtotal ({products.length} Items)</span>
                <span className="font-semibold text-neutral-800">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between items-center text-neutral-600">
                <span>Fully Insured Shipping</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between items-center text-neutral-600">
                <span>Estimated Taxes (included)</span>
                <span className="font-semibold text-neutral-800">3% GST Included</span>
              </div>
              
              <div className="border-t pt-4 flex justify-between items-center text-sm font-bold text-[#0B132B]">
                <span>Total Valuation</span>
                <span className="font-heading text-xl text-[#0B132B]">{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full mt-4"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Secure Checkout
            </Button>
            
            <div className="text-center">
              <span className="text-[10px] text-neutral-400 block">🔒 256-Bit SSL Encrypted Connection</span>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Cart;
