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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Search & Material Selector Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-200">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#0B132B]">
            {material === "gold" ? "Gold Collection" : "Silver Collection"}
          </h1>
          <p className="text-xs text-neutral-500 mt-1 font-sans">
            Showing dynamic live catalog priced using real-time market rates.
          </p>
        </div>

        {/* Material Selection Buttons */}
        <div className="flex items-center gap-3 bg-neutral-100 p-1.5 rounded-lg border border-neutral-200">
          <button
            onClick={() => {
              setSearchParams({ material: "gold" });
              setSearchInput("");
            }}
            className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${
              material === "gold"
                ? "bg-[#D4AF37] text-white shadow-md"
                : "text-[#0B132B] hover:text-[#D4AF37]"
            }`}
          >
            ★ Gold Catalog
          </button>
          <button
            onClick={() => {
              setSearchParams({ material: "silver" });
              setSearchInput("");
            }}
            className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${
              material === "silver"
                ? "bg-[#0B132B] text-[#D4AF37] shadow-md"
                : "text-[#0B132B] hover:text-[#D4AF37]"
            }`}
          >
            ✦ Silver Catalog
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block space-y-6">
          <form onSubmit={handleSearchSubmit} className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B132B]">Search Catalog</h3>
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search rings, necklaces..."
                className="w-full bg-white border border-neutral-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
              />
              <button type="submit" className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-[#D4AF37]">
                🔍
              </button>
            </div>
          </form>

          {meta.categories?.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B132B]">Category</h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => updateParam("category", "")}
                  className={`block text-xs text-left ${!category ? "text-[#D4AF37] font-bold" : "text-neutral-600 hover:text-[#D4AF37]"}`}
                >
                  All Categories
                </button>
                {meta.categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateParam("category", cat)}
                    className={`block text-xs text-left ${category === cat ? "text-[#D4AF37] font-bold" : "text-neutral-600 hover:text-[#D4AF37]"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {meta.wearingTypes?.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B132B]">Wearing Style</h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => updateParam("wearingType", "")}
                  className={`block text-xs text-left ${!wearingType ? "text-[#D4AF37] font-bold" : "text-neutral-600 hover:text-[#D4AF37]"}`}
                >
                  All Styles
                </button>
                {meta.wearingTypes.map((wt) => (
                  <button
                    key={wt}
                    onClick={() => updateParam("wearingType", wt)}
                    className={`block text-xs text-left ${wearingType === wt ? "text-[#D4AF37] font-bold" : "text-neutral-600 hover:text-[#D4AF37]"}`}
                  >
                    {wt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {meta.purities?.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B132B]">Purity</h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => updateParam("purity", "")}
                  className={`block text-xs text-left ${!purity ? "text-[#D4AF37] font-bold" : "text-neutral-600 hover:text-[#D4AF37]"}`}
                >
                  All Purities
                </button>
                {meta.purities.map((p) => (
                  <button
                    key={p}
                    onClick={() => updateParam("purity", p.toString())}
                    className={`block text-xs text-left ${purity === p.toString() ? "text-[#D4AF37] font-bold" : "text-neutral-600 hover:text-[#D4AF37]"}`}
                  >
                    {p}K {material === "gold" ? "Gold" : "Silver"}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button variant="outline" size="sm" className="w-full text-xs" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </aside>

        {/* Catalog Main Panel */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between bg-neutral-50 p-4 rounded-xl border border-neutral-200/80">
            <span className="text-xs text-neutral-500 font-medium">
              {products.length} {products.length === 1 ? "Product" : "Products"} Found
            </span>

            <div className="flex items-center gap-3">
              <label className="text-xs text-neutral-400">Sort By:</label>
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
                className="bg-white border border-neutral-200 rounded-md p-1.5 text-xs text-neutral-700 focus:outline-none"
              >
                <option value="createdAt-desc">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="weight-asc">Weight: Light to Heavy</option>
              </select>

              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden bg-[#0B132B] text-white p-2 rounded-md text-xs hover:bg-[#D4AF37]"
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