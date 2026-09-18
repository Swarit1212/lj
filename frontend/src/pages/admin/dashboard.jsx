import React, { useState, useEffect } from "react";
import API from "../../api/axios.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    activeProducts: 0,
  });

  // Rates Override Form State
  const [goldRate, setGoldRate] = useState("");
  const [silverRate, setSilverRate] = useState("");
  const [rateMessage, setRateMessage] = useState("");
  const [isUpdatingRates, setIsUpdatingRates] = useState(false);

  // New Analytics Stats
  const [popularProducts, setPopularProducts] = useState([]);
  const [customPendingCount, setCustomPendingCount] = useState(0);
  const [goldSold, setGoldSold] = useState(0);
  const [silverSold, setSilverSold] = useState(0);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Get recent orders
      const orderRes = await API.get("/orders/admin/all?limit=100");
      const list = orderRes.data?.orders || orderRes.data || [];
      setOrders(list.slice(0, 6)); // Show top 6 recent orders

      // 2. Fetch current rates from backend DB config
      const ratesRes = await API.get("/rates").catch(() => null);
      if (ratesRes?.data) {
        setGoldRate(ratesRes.data.gold || "");
        setSilverRate(ratesRes.data.silver || "");
      }

      // 3. Count products in catalog
      let productsCount = 12; // fallback catalog count
      try {
        const goldMeta = await API.get("/products/meta?material=gold");
        const silverMeta = await API.get("/products/meta?material=silver");
        productsCount = (goldMeta.data?.categories?.length || 0) + (silverMeta.data?.categories?.length || 0) + 8;
      } catch (err) {
        console.warn("Product meta lookup failed, using fallback catalog count", err);
      }

      // 4. Fetch popular products
      const popRes = await API.get("/products/admin/popular").catch(() => null);
      setPopularProducts(popRes?.data || []);

      // 5. Fetch custom orders pending
      const customRes = await API.get("/custom-orders/admin").catch(() => null);
      const customList = customRes?.data || [];
      const pendingCustom = customList.filter(o => o.status === "pending").length;
      setCustomPendingCount(pendingCustom);

      // 6. Calculate metrics
      let revenue = 0;
      let pending = 0;
      let gSold = 0;
      let sSold = 0;

      list.forEach((ord) => {
        if (ord.orderStatus !== "cancelled") {
          revenue += ord.totalAmount || 0;
          ord.items?.forEach((item) => {
            if (item.product) {
              const weight = Number(item.product.weight) || 0;
              const qty = Number(item.quantity) || 1;
              if (item.product.material === "gold") {
                gSold += weight * qty;
              } else if (item.product.material === "silver") {
                sSold += weight * qty;
              }
            }
          });
        }
        if (ord.orderStatus === "processing" || ord.orderStatus === "pending") {
          pending++;
        }
      });

      setGoldSold(gSold);
      setSilverSold(sSold);
      setStats({
        revenue,
        totalOrders: list.length,
        pendingOrders: pending,
        activeProducts: productsCount,
      });
    } catch (err) {
      console.error("Dashboard metric fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateRates = async (e) => {
    e.preventDefault();
    setRateMessage("");
    setIsUpdatingRates(true);

    try {
      const gRate = Number(goldRate);
      const sRate = Number(silverRate);

      if (isNaN(gRate) || gRate <= 0 || isNaN(sRate) || sRate <= 0) {
        setRateMessage("❌ Please enter valid positive pricing numbers.");
        setIsUpdatingRates(false);
        return;
      }

      await API.put("/rates", { material: "gold", pricePerGram: gRate });
      await API.put("/rates", { material: "silver", pricePerGram: sRate });

      setRateMessage("✨ Metal rates configured successfully! Changes are live across catalog pricing.");
      setTimeout(() => setRateMessage(""), 5000);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      setRateMessage(err.response?.data?.message || "❌ Failed to override rates.");
    } finally {
      setIsUpdatingRates(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col justify-center items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
        <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Loading Executive Analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-[#0B132B] tracking-tight">Management Overview</h1>
          <p className="text-xs text-neutral-500 mt-1.5 font-medium uppercase tracking-wider">
            Live Store metrics tracking revenue, metal inventories sold, and collections analytics.
          </p>
        </div>
        {customPendingCount > 0 && (
          <Link to="/admin/custom-orders" className="self-start sm:self-center">
            <span className="inline-flex items-center px-4 py-2 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold uppercase tracking-wider animate-pulse">
              🔔 {customPendingCount} Custom Leads Pending
            </span>
          </Link>
        )}
      </div>

      {/* Metrics Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[
          { label: "Gross Revenue", val: formatCurrency(stats.revenue), icon: "👑", color: "border-l-[#D4AF37]" },
          { label: "Orders Logged", val: stats.totalOrders, icon: "📜", color: "border-l-indigo-500" },
          { label: "Pending Orders", val: stats.pendingOrders, icon: "⏳", color: "border-l-amber-500" },
          { label: "Gold Volume Sold", val: `${goldSold.toFixed(2)} g`, icon: "🪙", color: "border-l-yellow-600" },
          { label: "Silver Volume Sold", val: `${silverSold.toFixed(2)} g`, icon: "🥈", color: "border-l-neutral-400" },
          { label: "Custom Leads", val: customPendingCount, icon: "🎨", color: "border-l-purple-500" },
        ].map((c, i) => (
          <div key={i} className={`bg-white p-5 rounded-2xl border-l-4 ${c.color} border border-neutral-200/80 shadow-xs flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200`}>
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-neutral-400 block">{c.label}</span>
              <span className="font-heading text-lg font-black text-[#0B132B] mt-1.5 block leading-none">{c.val}</span>
            </div>
            <span className="text-2xl filter drop-shadow-sm">{c.icon}</span>
          </div>
        ))}
      </div>

      {/* Grid Row 2: Recent Orders & Live Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders List */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-base font-bold text-[#0B132B]">Recent Order Queue</h2>
              <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                Latest 6
              </span>
            </div>
            
            {orders.length === 0 ? (
              <div className="py-14 text-center text-xs text-neutral-400 font-bold uppercase tracking-wider">
                No orders placed in system yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-100 text-neutral-400 font-extrabold uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Order ID</th>
                      <th className="pb-3 font-semibold">Customer</th>
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-sans">
                    {orders.map((ord) => (
                      <tr key={ord._id} className="text-neutral-700 hover:bg-neutral-50/40 transition-colors">
                        <td className="py-3 font-mono font-bold text-neutral-800">
                          #{ord._id.substring(ord._id.length - 8).toUpperCase()}
                        </td>
                        <td className="py-3 font-semibold text-[#0B132B]">
                          {ord.user?.name || "Guest Account"}
                        </td>
                        <td className="py-3 text-neutral-500">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                            ord.orderStatus === "delivered" ? "bg-green-100 text-green-700" :
                            ord.orderStatus === "cancelled" ? "bg-red-100 text-red-700" :
                            "bg-amber-100 text-amber-700"
                          }`}>
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="py-3 font-bold text-right text-[#0B132B]">
                          {formatCurrency(ord.totalAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Live Rates Override Admin Control */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-base font-bold text-[#0B132B]">Metal Rates Override</h2>
              <p className="text-[10px] text-neutral-400 mt-1 font-medium leading-relaxed">
                Manually adjust Gold and Silver base prices per gram. Changes propagate immediately to all product valuation lists.
              </p>
            </div>

            <form onSubmit={handleUpdateRates} className="space-y-4">
              <Input
                label="Gold Rate (per gram)"
                type="number"
                value={goldRate}
                onChange={(e) => setGoldRate(e.target.value)}
                placeholder="e.g. 7250"
                required
              />
              <Input
                label="Silver Rate (per gram)"
                type="number"
                value={silverRate}
                onChange={(e) => setSilverRate(e.target.value)}
                placeholder="e.g. 88"
                required
              />

              {rateMessage && (
                <div className={`p-3 rounded-xl text-[10px] font-bold tracking-wide leading-relaxed ${
                  rateMessage.includes("❌") ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                }`}>
                  {rateMessage}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full font-bold uppercase tracking-wider text-xs py-3 rounded-xl shadow-md transition-all duration-200"
                isLoading={isUpdatingRates}
              >
                Update Live Metal Rates
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Grid Row 3: Popular Products & Custom Atelier link card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Popular products list */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-base font-bold text-[#0B132B]">Popular Collections (Most Viewed)</h2>
            <span className="text-[9px] bg-amber-50 text-[#D4AF37] border border-[#D4AF37]/30 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
              Top 5 Items
            </span>
          </div>

          {popularProducts.length === 0 ? (
            <div className="py-14 text-center text-xs text-neutral-400 font-bold uppercase tracking-wider">
              No products found.
            </div>
          ) : (
            <div className="space-y-4">
              {popularProducts.map((p, idx) => (
                <div key={p._id} className="flex items-center justify-between border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3.5">
                    <span className="font-heading font-black text-sm text-[#D4AF37] w-4">
                      #{idx + 1}
                    </span>
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-neutral-100 shadow-2xs">
                      <img src={p.imageUrl} className="w-full h-full object-cover" alt={p.name} />
                    </div>
                    <div>
                      <span className="font-bold text-[#0B132B] text-xs block">{p.name}</span>
                      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                        {p.material} ({p.purity}K) • {p.weight}g
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-xs text-[#0B132B] block">{p.visitCount} Views</span>
                    <span className="text-[9px] text-[#D4AF37] font-extrabold uppercase tracking-wider">
                      Popular
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Custom Order Atelier Status Overview */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="font-heading text-base font-bold text-[#0B132B] mb-2">Custom Design Atelier Leads</h2>
            <p className="text-xs text-neutral-400 font-medium leading-relaxed mb-6">
              Customers submit their bespoke sketches, desired weights, and purity preferences. Review them, configure customized quotes, and contact them instantly.
            </p>

            <div className="p-5 bg-purple-50/30 border border-purple-100 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-500 block">
                  PENDING REVIEW QUEUE
                </span>
                <span className="font-heading text-3xl font-black text-[#0B132B] mt-1 block">
                  {customPendingCount} Requests
                </span>
              </div>
              <span className="text-4xl filter drop-shadow-xs">🎨</span>
            </div>
          </div>

          <div className="mt-8">
            <Link to="/admin/custom-orders" className="block w-full">
              <Button variant="primary" className="w-full text-xs font-bold uppercase tracking-wider py-3 rounded-xl">
                Open Custom Orders Dashboard →
              </Button>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
