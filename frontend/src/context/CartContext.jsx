import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";
import { authContext } from "./authContext";
import { toast } from "react-hot-toast";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(authContext);
  const [cart, setCart] = useState({ products: [], totalItems: 0, totalPrice: 0 });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) {
      setCart({ products: [], totalItems: 0, totalPrice: 0 });
      return;
    }
    setIsLoading(true);
    try {
      const res = await API.get("/cart");
      if (res.data) {
        const productsList = Array.isArray(res.data.products) 
          ? res.data.products 
          : (Array.isArray(res.data) ? res.data : []);
          
        setCart({
          products: productsList,
          totalItems: res.data.totalItems || productsList.length,
          totalPrice: res.data.totalPrice || 0,
        });
      }
    } catch (err) {
      console.warn("Cart fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.error("Please log in to add items to your bag");
      return;
    }
    try {
      const res = await API.post("/cart", { productId, quantity });
      if (res.data) {
        const productsList = Array.isArray(res.data.products) 
          ? res.data.products 
          : [];
        setCart({
          products: productsList,
          totalItems: res.data.totalItems || productsList.length,
          totalPrice: res.data.totalPrice || 0,
        });
      }
      toast.success("Added to premium bag!");
      setIsDrawerOpen(true);
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error(err.response?.data?.message || "Failed to add item to bag");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await API.delete(`/cart/${productId}`);
      if (res.data) {
        const productsList = Array.isArray(res.data.products) 
          ? res.data.products 
          : [];
        setCart({
          products: productsList,
          totalItems: res.data.totalItems || productsList.length,
          totalPrice: res.data.totalPrice || 0,
        });
      }
      toast.success("Item removed from bag");
    } catch (err) {
      console.error("Remove from cart error:", err);
      toast.error("Failed to remove item from bag");
    }
  };

  const clearCart = async () => {
    try {
      await API.delete("/cart/clear");
      setCart({ products: [], totalItems: 0, totalPrice: 0 });
      toast.success("Shopping bag cleared");
    } catch (err) {
      console.error("Clear cart error:", err);
      toast.error("Failed to clear shopping bag");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isDrawerOpen,
        setIsDrawerOpen,
        addToCart,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
