import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import LivePriceTicker from "./components/layout/LivePriceTicker";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import CartDrawer from "./components/cart/CartDrawer";
import ProtectedRoute from "./components/protectedRoute";
import AdminRoute from "./components/AdminRoute.jsx";
import AdminLayout from "./components/AdminLayout.jsx";

// Lazy loading all pages
const Home = React.lazy(() => import("./pages/home"));
const Shop = React.lazy(() => import("./pages/shop"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/register"));
const Profile = React.lazy(() => import("./pages/profile"));
const Cart = React.lazy(() => import("./pages/cart"));
const Checkout = React.lazy(() => import("./pages/checkout"));
const OrderConfirmation = React.lazy(() => import("./pages/orderConfirmation"));
const Orders = React.lazy(() => import("./pages/orders"));
const OrderDetail = React.lazy(() => import("./pages/orderDetail"));
const AdminDashboard = React.lazy(() => import("./pages/admin/dashboard.jsx"));
const AdminProducts = React.lazy(() => import("./pages/admin/products.jsx"));
const AdminOrders = React.lazy(() => import("./pages/admin/orders.jsx"));
const AdminCustomOrders = React.lazy(() => import("./pages/admin/AdminCustomOrders.jsx"));
const CustomOrder = React.lazy(() => import("./pages/CustomOrder"));
const SizeFinder = React.lazy(() => import("./pages/SizeFinder"));
const PriceCalculator = React.lazy(() => import("./pages/PriceCalculator"));
const NotFound = React.lazy(() => import("./pages/notFound"));

// Luxury fallback loader component
const PageLoader = () => (
  <div className="min-h-[85vh] flex flex-col justify-center items-center space-y-4 bg-[#FAFAFA]">
    <div className="relative">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#D4AF37]"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-[#0B132B]">
        LJ
      </div>
    </div>
    <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold animate-pulse">
      Entering Atelier...
    </p>
  </div>
);

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#1A1D20]">
      <Toaster
        position="top-right"
        toastOptions={{
          className: "font-sans text-xs border border-[#D4AF37]/20 shadow-lg !rounded-xl !p-4 !bg-white !text-[#0B132B]",
          success: {
            iconTheme: {
              primary: "#D4AF37",
              secondary: "#FFF",
            },
          },
        }}
      />
      <LivePriceTicker />
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/size-finder" element={<SizeFinder />} />
            <Route path="/price-calculator" element={<PriceCalculator />} />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-confirmation"
              element={
                <ProtectedRoute>
                  <OrderConfirmation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/custom-designs"
              element={
                <ProtectedRoute>
                  <CustomOrder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="custom-orders" element={<AdminCustomOrders />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
