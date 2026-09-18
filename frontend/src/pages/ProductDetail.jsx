import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import { useMetalRates } from "../context/MetalRateContext";
import { useCart } from "../context/CartContext";
import LivePriceBreakdown from "../components/product/LivePriceBreakdown";
import Button from "../components/common/Button";
import { Helmet } from "react-helmet-async";
import { SkeletonProductDetail } from "../components/common/Skeleton";

const ProductDetail = () => {
  const { id } = useParams();
  const { rates } = useMetalRates();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("specs");

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error("Error loading product details:", err);
      setError("Unable to retrieve details for this design. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return <SkeletonProductDetail />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <span className="text-4xl">⚠</span>
        <h2 className="font-heading text-2xl font-bold text-red-500">Atelier Sync Error</h2>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">{error}</p>
        <div className="flex justify-center gap-4">
          <Button variant="primary" onClick={fetchProduct}>Retry Loading</Button>
          <Link to="/shop">
            <Button variant="outline">Back to Collection</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <h2 className="font-heading text-2xl font-bold text-[#0B132B]">Masterwork Not Found</h2>
        <p className="text-xs text-neutral-500 font-light">The product you are trying to view does not exist or has been removed from our catalog.</p>
        <Link to="/shop">
          <Button variant="primary">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  const isGold = product.material?.toLowerCase() === "gold";
  const karat = product.karat || (isGold ? "22k" : "925");

  let ratePerGram = rates?.gold22k || 6650;
  if (isGold) {
    if (karat?.toLowerCase() === "24k") ratePerGram = rates?.gold24k || 7250;
    else if (karat?.toLowerCase() === "18k") ratePerGram = rates?.gold18k || 5440;
    else ratePerGram = rates?.gold22k || 6650;
  } else {
    ratePerGram = rates?.silver || 88;
  }

  return (
    <>
      <Helmet>
        <title>{`${product.name} - Pure ${product.material?.toUpperCase()} Fine Jewelry`} | LJ Jewelry</title>
        <meta name="description" content={product.description || `Explore ${product.name}, a luxury ${product.material} ${product.category} crafted to perfection.`} />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-3xl overflow-hidden border border-gold-500/10 shadow-md transform hover:scale-[1.01] transition-all duration-500">
              <img
                src={product.imageUrl || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-gold-500 block mb-1">
                {product.category} • {product.wearingType}
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-royal-navy">
                {product.name}
              </h1>
              <p className="text-xs text-neutral-400 font-light mt-3 leading-relaxed font-sans">
                {product.description || "Indulge in our exquisite artisan craftsmanship, designed with pristine quality metals and pure stones."}
              </p>
            </div>

            <LivePriceBreakdown
              weight={product.weight}
              ratePerGram={ratePerGram}
              makingCharge={product.makingCharge}
              material={product.material}
              karat={karat}
            />

            <div className="flex items-center gap-6 pt-4 border-t border-neutral-100/70">
              <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-xs font-sans">
                <button
                  onClick={() => setQty(prev => Math.max(1, prev - 1))}
                  className="px-4 py-2.5 hover:bg-neutral-50 font-bold text-neutral-600 transition-colors cursor-pointer text-sm"
                >
                  -
                </button>
                <span className="px-5 py-2 text-xs font-bold text-royal-navy bg-neutral-50/50 border-x border-neutral-200/60">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(prev => prev + 1)}
                  className="px-4 py-2.5 hover:bg-neutral-50 font-bold text-neutral-600 transition-colors cursor-pointer text-sm"
                >
                  +
                </button>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={() => addToCart(product._id, qty)}
                className="flex-1 !py-3.5 !text-[11px] !font-bold !tracking-widest rounded-xl shadow-lg shadow-gold-500/10"
              >
                ADD TO PREMIUM BAG
              </Button>
            </div>

            <div className="mt-10 border border-gold-500/10 rounded-2xl overflow-hidden bg-white shadow-xs">
              <div className="flex p-1 bg-neutral-100/70 border-b border-neutral-200/40">
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`flex-1 py-2.5 rounded-xl text-[10px] uppercase font-bold tracking-widest transition-all duration-300 cursor-pointer ${
                    activeTab === "specs"
                      ? "text-gold-500 bg-white shadow-xs border border-gold-500/5 font-extrabold"
                      : "text-neutral-500 hover:text-royal-navy"
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab("shipping")}
                  className={`flex-1 py-2.5 rounded-xl text-[10px] uppercase font-bold tracking-widest transition-all duration-300 cursor-pointer ${
                    activeTab === "shipping"
                      ? "text-gold-500 bg-white shadow-xs border border-gold-500/5 font-extrabold"
                      : "text-neutral-500 hover:text-royal-navy"
                  }`}
                >
                  Insured Shipping
                </button>
              </div>

              <div className="p-6 text-xs text-neutral-500 leading-relaxed font-sans">
                {activeTab === "specs" && (
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                    <div className="font-bold text-neutral-400 uppercase tracking-widest text-[9px]">Metal Material:</div>
                    <div className="text-royal-navy font-bold capitalize">{product.material}</div>
                    
                    <div className="font-bold text-neutral-400 uppercase tracking-widest text-[9px]">Purity Rating:</div>
                    <div className="text-royal-navy font-bold">{karat.toUpperCase()}</div>

                    <div className="font-bold text-neutral-400 uppercase tracking-widest text-[9px]">Total Net Weight:</div>
                    <div className="text-royal-navy font-bold">{product.weight} Grams</div>

                    <div className="font-bold text-neutral-400 uppercase tracking-widest text-[9px]">Certification:</div>
                    <div className="text-royal-navy font-bold flex items-center gap-1">🛡️ BIS Laser Hallmarked</div>
                  </div>
                )}

                {activeTab === "shipping" && (
                  <p className="font-light">
                    Every order from LJ Jewelry is shipped in secure, tamper-evident packaging. Delivery is fully insured by transit specialists. Expect standard shipping within 3-5 business days. Free returns and alterations can be processed under our lifetime exchange policies.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
