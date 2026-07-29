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
    <div className="group relative bg-white rounded-xl border border-neutral-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col h-full">
      {/* Badge Top Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        <Badge variant={isGold ? "gold" : "silver"}>
          {isGold ? `${karat.toUpperCase()} Gold` : "925 Silver"}
        </Badge>
      </div>

      {/* Image Container */}
      <Link to={`/product/${product._id}`} className="relative block aspect-square bg-neutral-50 overflow-hidden">
        <img
          src={product.imageUrl || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80"}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/95 text-[#0B132B] font-semibold text-xs uppercase tracking-wider px-4 py-2 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
            Quick View
          </span>
        </div>
      </Link>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-1">
            {product.category || "Jewelry"} • {product.weight}g
          </span>
          <Link to={`/product/${product._id}`}>
            <h3 className="font-heading text-lg font-bold text-[#0B132B] group-hover:text-[#D4AF37] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Dynamic Pricing Breakdown */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-end justify-between">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Live Price</span>
            <span className="text-lg font-bold text-[#0B132B] font-heading">
              {formatCurrency(totalPrice)}
            </span>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={() => addToCart(product._id, 1)}
            className="!px-3 !py-1.5 text-xs"
          >
            Add +
          </Button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
