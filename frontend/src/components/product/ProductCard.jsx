import React from "react";
import { Link } from "react-router-dom";
import { useMetalRates } from "../../context/MetalRateContext";
import { useCart } from "../../context/CartContext";
import { calculateProductPrice } from "../../utils/priceCalculator";
import { formatCurrency } from "../../utils/formatCurrency";
import Badge from "../common/Badge";
import Button from "../common/Button";

export const ProductCard = React.memo(({ product }) => {
  const { rates } = useMetalRates();
  const { addToCart } = useCart();

  const isGold = product?.material?.toLowerCase() === "gold";
  const karat = product?.karat || (isGold ? "22k" : "925");
  
  // Rate mapping per material/karat
  let ratePerGram = rates.gold22k;
  if (isGold) {
    if (karat?.toLowerCase() === "24k") ratePerGram = rates.gold24k;
    else if (karat?.toLowerCase() === "18k") ratePerGram = rates.gold18k;
    else ratePerGram = rates.gold22k;
  } else {
    ratePerGram = rates.silver;
  }

  const { totalPrice, basePrice, makingCharge } = calculateProductPrice(product, ratePerGram);

  return (
    <div className="group relative bg-white rounded-2xl border border-gold-500/10 overflow-hidden shadow-xs hover:shadow-xl hover:shadow-gold-500/5 hover:border-gold-500/30 transition-all duration-500 flex flex-col h-full transform hover:-translate-y-1.5">
      {/* Badge Top Overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
        <span className={`text-[9px] font-bold uppercase tracking-widest bg-white/90 backdrop-blur-md px-3 py-1 rounded-md border shadow-xs ${
          isGold 
            ? "text-gold-700 border-gold-500/20" 
            : "text-neutral-600 border-neutral-200"
        }`}>
          {isGold ? `${karat.toUpperCase()} Gold` : "925 Silver"}
        </span>
      </div>

      {/* Image Container */}
      <Link to={`/product/${product._id}`} className="relative block aspect-square bg-[#FAF9F6] overflow-hidden">
        <img
          src={product.imageUrl || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80"}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-royal-navy/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <span className="bg-white text-royal-navy font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded-md shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            View Details
          </span>
        </div>
      </Link>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-gold-500 block mb-1.5">
            {product.category || "Jewelry"} • {product.weight}g
          </span>
          <Link to={`/product/${product._id}`}>
            <h3 className="font-heading text-lg font-medium text-royal-navy group-hover:text-gold-500 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Dynamic Pricing Breakdown */}
        <div className="mt-5 pt-4 border-t border-neutral-100/70 flex items-end justify-between">
          <div>
            <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest block mb-0.5">Live Price</span>
            <span className="text-lg font-bold text-royal-navy font-heading">
              {formatCurrency(totalPrice)}
            </span>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={() => addToCart(product._id, 1)}
            className="!px-3.5 !py-1.5 !text-[10px] !font-bold !tracking-wider rounded-lg shadow-sm"
          >
            ADD
          </Button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
