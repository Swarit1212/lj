import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatCurrency";
import Button from "../common/Button";

export const CartDrawer = () => {
  const { cart, isDrawerOpen, setIsDrawerOpen, removeFromCart, clearCart } = useCart();

  if (!isDrawerOpen) return null;

  const products = cart?.products || [];
  const totalPrice = cart?.totalPrice || 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Right Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#D4AF37]/30">
          {/* Header */}
          <div className="p-6 bg-[#0B132B] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-heading text-xl font-bold text-[#D4AF37]">
                YOUR CART
              </span>
              <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-bold">
                {products.length} Items
              </span>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="text-neutral-400 hover:text-white text-xl p-1"
            >
              ✕
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-neutral-100">
            {products.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">💎</div>
                <h4 className="font-heading text-lg font-bold text-[#0B132B] mb-1">
                  Your cart is currently empty
                </h4>
                <p className="text-xs text-neutral-500 mb-6">
                  Explore our luxury gold and silver collections to add exquisite items.
                </p>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="btn btn-outline"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              products.map((item) => {
                const prod = item.product || {};
                return (
                  <div key={item._id || prod._id} className="pt-4 flex gap-4 items-center">
                    <img
                      src={
                        prod.imageUrl ||
                        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=200&q=80"
                      }
                      alt={prod.name}
                      className="w-16 h-16 object-cover rounded-lg border border-neutral-200"
                    />
                    <div className="flex-1">
                      <h4 className="font-heading text-sm font-bold text-[#0B132B] line-clamp-1">
                        {prod.name || "Luxury Item"}
                      </h4>
                      <p className="text-[11px] text-neutral-500">
                        Qty: {item.quantity} × {formatCurrency(item.price)}
                      </p>
                      <p className="text-xs font-bold text-[#D4AF37] mt-0.5">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(prod._id || item._id)}
                      className="text-neutral-400 hover:text-red-500 text-xs p-1"
                    >
                      Remove
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {products.length > 0 && (
            <div className="p-6 bg-[#FAFAFA] border-t border-neutral-200 space-y-4">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-heading text-xl font-bold text-[#0B132B]">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Shipping and taxes calculated at checkout. Free insured delivery included.
              </p>
              <div className="space-y-2">
                <Link
                  to="/checkout"
                  onClick={() => setIsDrawerOpen(false)}
                  className="block w-full"
                >
                  <Button variant="primary" className="w-full">
                    Proceed to Checkout
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-neutral-500"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
