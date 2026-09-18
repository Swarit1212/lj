import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";
import ProductCard from "../components/product/ProductCard";
import Button from "../components/common/Button";
import { useMetalRates } from "../context/MetalRateContext";
import { Helmet } from "react-helmet-async";
import { SkeletonCard } from "../components/common/Skeleton";

const Shop = () => {
  const { rates } = useMetalRates();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({
    categories: [],
    wearingTypes: [],
    purities: [],
    weightRange: { minWeight: 0, maxWeight: 50 }
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Read filter params from URL
  const material = searchParams.get("material") || "gold";
  const category = searchParams.get("category") || "";
  const wearingType = searchParams.get("wearingType") || "";
  const purity = searchParams.get("purity") || "";
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const minWeight = searchParams.get("minWeight") || "";
  const maxWeight = searchParams.get("maxWeight") || "";

  const [searchInput, setSearchInput] = useState(q);

  // Sync search input state if URL query param is cleared/changed externally
  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  // Debounce search input changes to update URL query param
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchInput !== q) {
        updateParam("q", searchInput);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  // Fetch metadata when material changes
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await API.get(`/products/meta?material=${material}`);
        if (res.data) {
          setMeta(res.data);
        }
      } catch (err) {
        console.error("Error fetching shop metadata:", err);
      }
    };
    fetchMeta();
  }, [material]);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      const params = {
        material,
        page,
        limit: 12,
        sortBy,
        sortOrder,
      };
      if (category) params.category = category;
      if (wearingType) params.wearingType = wearingType;
      if (purity) params.purity = purity;
      if (minWeight) params.minWeight = minWeight;
      if (maxWeight) params.maxWeight = maxWeight;

      if (q) {
        params.q = q;
        res = await API.get("/products/search", { params });
        const list = res.data.results || res.data || [];
        setProducts(list);
      } else {
        res = await API.get("/products", { params });
        const list = res.data.allProducts || res.data || [];
        setProducts(list);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Unable to retrieve catalog item list. Please verify your server connection.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [material, category, wearingType, purity, q, page, sortBy, sortOrder, minWeight, maxWeight]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam("q", searchInput);
  };

  const clearFilters = () => {
    setSearchParams({ material });
    setSearchInput("");
  };

  return (
    <>
      <Helmet>
        <title>{material === "gold" ? "Premium Gold Jewelry Collection" : "Exquisite Sterling Silver Collection"} | LJ Jewelry</title>
        <meta name="description" content={`Browse our exclusive catalog of fine artisan ${material === "gold" ? "gold rings, custom gold necklaces, and bangles with live purity pricing" : "925 silver cuffs, drop earrings, and necklaces with live rates"} index.`} />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Search & Material Selector Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-200/60">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-royal-navy">
            {material === "gold" ? "Gold Catalog" : "Silver Catalog"}
          </h1>
          <p className="text-xs text-neutral-400 mt-1.5 font-sans font-medium">
            Exquisite jewelry priced dynamically using live market rates.
          </p>
        </div>

        {/* Material Selection Buttons */}
        <div className="flex items-center gap-2.5 bg-neutral-100/80 p-1.5 rounded-xl border border-neutral-200/50">
          <button
            onClick={() => {
              setSearchParams({ material: "gold" });
              setSearchInput("");
            }}
            className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer ${
              material === "gold"
                ? "bg-gradient-to-r from-gold-500 to-gold-600 text-royal-navy shadow-md font-extrabold"
                : "text-neutral-500 hover:text-gold-500"
            }`}
          >
            ★ Gold Catalog
          </button>
          <button
            onClick={() => {
              setSearchParams({ material: "silver" });
              setSearchInput("");
            }}
            className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer ${
              material === "silver"
                ? "bg-royal-navy text-gold-500 shadow-md font-extrabold border border-gold-500/25"
                : "text-neutral-500 hover:text-gold-500"
            }`}
          >
            ✦ Silver Catalog
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mt-10">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block space-y-8 bg-white border border-gold-500/10 p-6 rounded-2xl shadow-xs">
          <form onSubmit={handleSearchSubmit} className="space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-royal-navy">Search Catalog</h3>
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search rings, necklaces..."
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-gold-500/35 focus:outline-none focus:border-gold-500/50 focus:bg-white transition-all shadow-xs"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-neutral-400 hover:text-gold-500 cursor-pointer">
                🔍
              </button>
            </div>
          </form>

          {meta.categories?.length > 0 && (
            <div className="space-y-3 border-t border-neutral-100 pt-6">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-royal-navy">Category</h3>
              <div className="space-y-2 flex flex-col items-start">
                <button
                  onClick={() => updateParam("category", "")}
                  className={`text-xs text-left cursor-pointer transition-all duration-200 hover:translate-x-1 ${!category ? "text-gold-500 font-bold" : "text-neutral-500 hover:text-gold-500"}`}
                >
                  {!category ? "✦ All Categories" : "All Categories"}
                </button>
                {meta.categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateParam("category", cat)}
                    className={`text-xs text-left cursor-pointer transition-all duration-200 hover:translate-x-1 ${category === cat ? "text-gold-500 font-bold" : "text-neutral-500 hover:text-gold-500"}`}
                  >
                    {category === cat ? `✦ ${cat}` : cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {meta.wearingTypes?.length > 0 && (
            <div className="space-y-3 border-t border-neutral-100 pt-6">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-royal-navy">Wearing Style</h3>
              <div className="space-y-2 flex flex-col items-start">
                <button
                  onClick={() => updateParam("wearingType", "")}
                  className={`text-xs text-left cursor-pointer transition-all duration-200 hover:translate-x-1 ${!wearingType ? "text-gold-500 font-bold" : "text-neutral-500 hover:text-gold-500"}`}
                >
                  {!wearingType ? "✦ All Styles" : "All Styles"}
                </button>
                {meta.wearingTypes.map((wt) => (
                  <button
                    key={wt}
                    onClick={() => updateParam("wearingType", wt)}
                    className={`text-xs text-left cursor-pointer transition-all duration-200 hover:translate-x-1 ${wearingType === wt ? "text-gold-500 font-bold" : "text-neutral-500 hover:text-gold-500"}`}
                  >
                    {wearingType === wt ? `✦ ${wt}` : wt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {meta.purities?.length > 0 && (
            <div className="space-y-3 border-t border-neutral-100 pt-6">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-royal-navy">Purity</h3>
              <div className="space-y-2 flex flex-col items-start">
                <button
                  onClick={() => updateParam("purity", "")}
                  className={`text-xs text-left cursor-pointer transition-all duration-200 hover:translate-x-1 ${!purity ? "text-gold-500 font-bold" : "text-neutral-500 hover:text-gold-500"}`}
                >
                  {!purity ? "✦ All Purities" : "All Purities"}
                </button>
                {meta.purities.map((p) => (
                  <button
                    key={p}
                    onClick={() => updateParam("purity", p.toString())}
                    className={`text-xs text-left cursor-pointer transition-all duration-200 hover:translate-x-1 ${purity === p.toString() ? "text-gold-500 font-bold" : "text-neutral-500 hover:text-gold-500"}`}
                  >
                    {purity === p.toString() ? `✦ ${p}K ${material === "gold" ? "Gold" : "Silver"}` : `${p}K ${material === "gold" ? "Gold" : "Silver"}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-neutral-100 pt-6">
            <Button variant="outline" size="sm" className="w-full !text-[10px] font-bold tracking-widest py-3 rounded-xl hover:shadow-xs active:scale-[0.98]" onClick={clearFilters}>
              CLEAR FILTERS
            </Button>
          </div>
        </aside>

        {/* Catalog Main Panel */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between bg-white px-5 py-4 rounded-2xl border border-gold-500/10 shadow-xs">
            <span className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest">
              {products.length} {products.length === 1 ? "Masterpiece" : "Masterpieces"} Found
            </span>

            <div className="flex items-center gap-3">
              <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Sort By:</label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sb, so] = e.target.value.split("-");
                  updateParam("sortBy", sb);
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set("sortBy", sb);
                  newParams.set("sortOrder", so);
                  setSearchParams(newParams);
                }}
                className="bg-neutral-50 border border-neutral-200/80 rounded-lg py-1.5 px-3 text-xs text-neutral-700 font-medium focus:outline-none focus:border-gold-500/40 cursor-pointer shadow-xs transition-colors hover:bg-neutral-100/50"
              >
                <option value="createdAt-desc">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="weight-asc">Weight: Light to Heavy</option>
              </select>

              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden bg-royal-navy text-gold-500 border border-gold-500/25 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gold-500 hover:text-royal-navy transition-colors duration-200 cursor-pointer"
              >
                Filters ☰
              </button>
            </div>
          </div>

          {error ? (
            <div className="text-center py-20 bg-white border border-neutral-200 rounded-xl space-y-6">
              <span className="text-4xl">⚠</span>
              <h3 className="font-heading text-xl font-bold text-red-500 mt-4">Unable to Load Catalog</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">{error}</p>
              <Button variant="primary" onClick={fetchProducts}>
                Retry Connection
              </Button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white border border-neutral-200 rounded-xl">
              <span className="text-4xl">💎</span>
              <h3 className="font-heading text-xl font-bold text-[#0B132B] mt-4">No masterworks match your criteria</h3>
              <p className="text-xs text-neutral-500 mt-2 max-w-sm mx-auto">
                Try clearing selected filters or tweaking search terms to discover our premium inventory.
              </p>
              <Button variant="primary" className="mt-6" onClick={clearFilters}>
                View Full Catalog
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute inset-y-0 right-0 w-80 bg-white shadow-2xl flex flex-col p-6 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="font-heading text-lg font-bold text-[#0B132B]">Filters</h2>
              <button onClick={() => setShowMobileFilters(false)} className="text-neutral-500 hover:text-black">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6">
              {meta.categories?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B132B]">Category</h3>
                  <div className="space-y-1.5">
                    {meta.categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          updateParam("category", category === cat ? "" : cat);
                          setShowMobileFilters(false);
                        }}
                        className={`block text-xs ${category === cat ? "text-[#D4AF37] font-bold" : "text-neutral-600"}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <Button variant="primary" className="w-full" onClick={() => setShowMobileFilters(false)}>
                Show Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Shop;