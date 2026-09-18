import React from "react";
import { formatCurrency } from "../../utils/formatCurrency";

export const LivePriceBreakdown = ({
  weight = 0,
  ratePerGram = 0,
  makingCharge = 0,
  material = "gold",
  karat = "22k",
}) => {
  const basePrice = Math.round(weight * ratePerGram);
  const totalBeforeTax = basePrice + makingCharge;
  const gst = Math.round(totalBeforeTax * 0.03); // 3% GST on gold/silver jewelry
  const finalPrice = totalBeforeTax + gst;

  return (
    <div className="bg-white border border-gold-500/15 rounded-2xl p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
        <h4 className="font-heading text-base font-bold text-royal-navy flex items-center gap-2">
          <span>✨ Live Valuation Summary</span>
        </h4>
        <span className="text-[9px] bg-gold-500/10 border border-gold-500/20 text-gold-700 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
          3% GST Included
        </span>
      </div>

      <div className="mt-5 space-y-3 text-xs text-neutral-500">
        <div className="flex justify-between items-center">
          <span className="tracking-wide">
            Base Material Cost ({weight}g × {formatCurrency(ratePerGram)}/g)
          </span>
          <span className="font-semibold text-royal-navy">{formatCurrency(basePrice)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="tracking-wide">Artisan Making Charges</span>
          <span className="font-semibold text-royal-navy">{formatCurrency(makingCharge)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="tracking-wide">Government GST (3%)</span>
          <span className="font-semibold text-royal-navy">{formatCurrency(gst)}</span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
        <div>
          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-0.5">
            Total Price
          </span>
          <span className="font-heading text-3xl font-bold text-royal-navy">
            {formatCurrency(finalPrice)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block mb-0.5">
            ✓ BIS Hallmarked
          </span>
          <span className="text-[9px] text-neutral-400 font-medium">100% Certified Purity</span>
        </div>
      </div>
    </div>
  );
};

export default LivePriceBreakdown;
