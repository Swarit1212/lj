import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import ProductCard from "../components/product/ProductCard";
import Button from "../components/common/Button";
import { Helmet } from "react-helmet-async";

// Import generated luxury jewelry assets from src/assets
import heroBanner from "../assets/hero_banner.png";
import solitaireRing from "../assets/solitaire_ring.png";
import goldNecklace from "../assets/gold_necklace.png";

const sampleFeaturedProducts = [
  {
    _id: "sample-1",
    name: "Empress Solitaire Diamond Ring",
    material: "gold",
    karat: "18k",
    weight: 4.8,
    makingCharge: 2500,
    category: "Rings",
    imageUrl: solitaireRing,
  },
  {
    _id: "sample-2",
    name: "Royal Heritage Gold Necklace",
    material: "gold",
    karat: "22k",
    weight: 18.5,
    makingCharge: 6500,
    category: "Necklaces",
    imageUrl: goldNecklace,
  },
  {
    _id: "sample-3",
    name: "Celestial 925 Silver Cuff",
    material: "silver",
    karat: "925",
    weight: 12.0,
    makingCharge: 1200,
    category: "Bracelets",
    imageUrl:
      "https://images.unsplash.com/photo-1611591475777-233ca732308d?auto=format&fit=crop&w=600&q=80",
  },
  {
    _id: "sample-4",
    name: "Aura Rose Gold Drop Earrings",
    material: "gold",
    karat: "18k",
    weight: 6.2,
    makingCharge: 3100,
    category: "Earrings",
    imageUrl:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
  },
];

export const Home = () => {
  const [products, setProducts] = useState(sampleFeaturedProducts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await API.get("/products?material=gold&limit=8");
        const list = Array.isArray(res.data) 
          ? res.data 
          : (Array.isArray(res.data?.allProducts) ? res.data.allProducts : []);
          
        if (list.length > 0) {
          setProducts(list);
        }
      } catch (err) {
        console.warn("Using sample catalog items for display:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const productList = Array.isArray(products) ? products : sampleFeaturedProducts;

  return (
    <>
      <Helmet>
        <title>LJ Jewelry | Luxury & Atelier Fine Jewelry Store</title>
        <meta name="description" content="Discover certified, exquisite gold and silver jewelry from our masterworks catalog. Priced transparently using real-time market rates." />
      </Helmet>
      <div className="space-y-20 pb-20">
      {/* Hero Section with Jewelry Background Image */}
      <section
        className="relative min-h-[640px] bg-cover bg-center bg-no-repeat text-white flex items-center justify-center overflow-hidden border-b border-gold-500/30 shadow-xl"
        style={{ backgroundImage: `url(${heroBanner})` }}
      >
        {/* Dark Luxury Gradient Overlay for high readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-royal-navy via-royal-navy/80 to-royal-navy/40" />

        <div className="relative max-w-5xl mx-auto px-6 text-center space-y-8 z-10 py-24 animate-fade-in-up">
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold-500 font-bold block bg-royal-navy/70 backdrop-blur-md px-5 py-2 rounded-full w-fit mx-auto border border-gold-500/25 shadow-sm">
            ATELIER & BESPOKE FINE JEWELRY
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight drop-shadow-lg">
            Crafted for Eternity, <br />
            <span className="gold-gradient-text font-serif italic">Priced with Pure Transparency</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-300 font-light leading-relaxed drop-shadow-xs font-sans">
            Discover certified 18K/22K Gold and 925 Sterling Silver jewelry with live metal market pricing and artisan craftsmanship.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link to="/shop">
              <Button variant="primary" size="lg" className="shadow-lg shadow-gold-500/10">
                Explore Royal Collection
              </Button>
            </Link>
            <Link to="/shop?material=gold">
              <Button variant="outline" size="lg" className="!border-white/40 !text-white hover:!border-gold-500 backdrop-blur-xs">
                View Gold Rates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gold-500 font-bold block mb-1">
            CURATED COLLECTIONS
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-royal-navy">
            Shop by Category
          </h2>
          <div className="w-16 h-[1.5px] bg-gold-500/60 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Solitaire Rings", image: solitaireRing, link: "/shop?category=Rings" },
            { title: "Gold Necklaces", image: goldNecklace, link: "/shop?category=Necklaces" },
            { title: "Diamond Earrings", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80", link: "/shop?category=Earrings" },
            { title: "Custom Bracelets", image: "https://images.unsplash.com/photo-1611591475777-233ca732308d?auto=format&fit=crop&w=400&q=80", link: "/shop?category=Bracelets" },
          ].map((cat, idx) => (
            <Link
              key={idx}
              to={cat.link}
              className="group relative aspect-4/5 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-gold-500/20 transition-all duration-500 border border-gold-500/10 bg-neutral-100"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-royal-navy via-royal-navy/20 to-transparent flex items-end p-6">
                <div className="w-full">
                  <h3 className="font-heading text-xl font-bold text-white group-hover:text-gold-500 transition-colors">
                    {cat.title}
                  </h3>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold flex items-center gap-1 mt-2 group-hover:text-gold-500 group-hover:translate-x-1.5 transition-all duration-300">
                    Explore collection →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold-500 font-bold block mb-1">
              SEASONAL SELECTION
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-royal-navy">
              Featured Masterpieces
            </h2>
            <div className="w-16 h-[1.5px] bg-gold-500/60 mt-4"></div>
          </div>
          <Link to="/shop">
            <Button variant="outline" size="sm" className="shadow-xs font-bold text-[10px] tracking-widest">
              VIEW FULL CATALOG →
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {productList.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Trust & Craftsmanship Highlights */}
      <section className="bg-royal-navy text-white py-20 border-y border-gold-500/20 relative overflow-hidden">
        {/* Abstract background light effect */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <div className="p-8 rounded-2xl bg-[#0C1222]/80 border border-gold-500/10 space-y-4 hover:border-gold-500/30 transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-gold-500/10 text-gold-500 flex items-center justify-center text-2xl border border-gold-500/20">
              🏆
            </div>
            <h4 className="font-heading text-lg font-bold text-gold-500 tracking-wider">
              100% BIS Hallmarked
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
              Every gold and silver item comes certified with official laser-engraved hallmarking for absolute purity assurance.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#0C1222]/80 border border-gold-500/10 space-y-4 hover:border-gold-500/30 transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-gold-500/10 text-gold-500 flex items-center justify-center text-2xl border border-gold-500/20">
              📈
            </div>
            <h4 className="font-heading text-lg font-bold text-gold-500 tracking-wider">
              Live Transparent Pricing
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
              Prices update dynamically based on live metal exchange rates and fixed artisan making charges. No hidden markups.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#0C1222]/80 border border-gold-500/10 space-y-4 hover:border-gold-500/30 transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-gold-500/10 text-gold-500 flex items-center justify-center text-2xl border border-gold-500/20">
              🛡️
            </div>
            <h4 className="font-heading text-lg font-bold text-gold-500 tracking-wider">
              Insured Doorstep Delivery
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
              Fully insured transit with tamper-evident luxury packaging and 100% secure payment gateways.
            </p>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default Home;
