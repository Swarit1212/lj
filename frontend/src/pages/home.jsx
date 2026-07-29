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
      <div className="space-y-16 pb-16">
      {/* Hero Section with Jewelry Background Image */}
      <section
        className="relative min-h-[580px] bg-cover bg-center bg-no-repeat text-white flex items-center justify-center overflow-hidden border-b border-[#D4AF37]/40 shadow-2xl"
        style={{ backgroundImage: `url(${heroBanner})` }}
      >
        {/* Dark Luxury Gradient Overlay for high readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B132B]/95 via-[#0B132B]/80 to-[#0B132B]/60" />

        <div className="relative max-w-5xl mx-auto px-6 text-center space-y-6 z-10 py-20">
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold block bg-[#0B132B]/60 backdrop-blur-md px-4 py-1.5 rounded-full w-fit mx-auto border border-[#D4AF37]/30">
            ATELIER & BESPOKE FINE JEWELRY
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight drop-shadow-md">
            Crafted for Eternity, <br />
            <span className="gold-gradient-text font-serif">Priced with Pure Transparency</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-200 font-light leading-relaxed drop-shadow-sm">
            Discover certified 18K/22K Gold and 925 Sterling Silver jewelry with live metal market pricing and artisan craftsmanship.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link to="/shop">
              <Button variant="primary" size="lg">
                Explore Royal Collection
              </Button>
            </Link>
            <Link to="/shop?material=gold">
              <Button variant="outline" size="lg" className="!border-white/40 !text-white hover:!border-[#D4AF37] backdrop-blur-xs">
                View Gold Rates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">
            CURATED COLLECTIONS
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0B132B]">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Solitaire Rings", image: solitaireRing, link: "/shop?category=Rings" },
            { title: "Gold Necklaces", image: goldNecklace, link: "/shop?category=Necklaces" },
            { title: "Diamond Earrings", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80", link: "/shop?category=Earrings" },
            { title: "Custom Bracelets", image: "https://images.unsplash.com/photo-1611591475777-233ca732308d?auto=format&fit=crop&w=400&q=80", link: "/shop?category=Bracelets" },
          ].map((cat, idx) => (
            <Link
              key={idx}
              to={cat.link}
              className="group relative aspect-4/5 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-neutral-200"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B]/90 via-black/20 to-transparent flex items-end p-6">
                <div>
                  <h3 className="font-heading text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    {cat.title}
                  </h3>
                  <span className="text-xs text-neutral-300 font-semibold flex items-center gap-1 mt-1 group-hover:translate-x-1 transition-transform">
                    Explore items →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">
              SEASONAL SELECTION
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0B132B]">
              Featured Masterpieces
            </h2>
          </div>
          <Link to="/shop">
            <Button variant="outline" size="sm">
              View All Catalog →
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productList.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Trust & Craftsmanship Highlights */}
      <section className="bg-[#0B132B] text-white py-16 border-y border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-2xl mx-auto">
              🏆
            </div>
            <h4 className="font-heading text-xl font-bold text-[#D4AF37]">
              100% BIS Hallmarked
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Every gold and silver item comes certified with official laser-engraved hallmarking for absolute purity assurance.
            </p>
          </div>

          <div className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-2xl mx-auto">
              📈
            </div>
            <h4 className="font-heading text-xl font-bold text-[#D4AF37]">
              Live Transparent Pricing
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Prices update dynamically based on live metal exchange rates and fixed artisan making charges. No hidden markups.
            </p>
          </div>

          <div className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-2xl mx-auto">
              🛡️
            </div>
            <h4 className="font-heading text-xl font-bold text-[#D4AF37]">
              Insured Doorstep Delivery
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
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
