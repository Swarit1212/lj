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
    <div className="bg-[#FAFAFA] border border-[#D4AF37]/30 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
        <h4 className="font-heading text-lg font-bold text-[#0B132B] flex items-center gap-2">
          <span>✨ Live Transparent Valuation</span>
        </h4>
        <span className="text-xs bg-[#D4AF37]/15 text-[#92710c] px-2.5 py-1 rounded-full font-semibold">
          3% GST Included
        </span>
      </div>

      <div className="mt-4 space-y-2.5 text-xs text-neutral-600">
        <div className="flex justify-between items-center">
          <span>
            Material Base Cost ({weight}g × {formatCurrency(ratePerGram)}/g)
          </span>
          <span className="font-semibold text-neutral-800">{formatCurrency(basePrice)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Artisan Making Charges</span>
          <span className="font-semibold text-neutral-800">{formatCurrency(makingCharge)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>GST (3%)</span>
          <span className="font-semibold text-neutral-800">{formatCurrency(gst)}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
            Total Price
          </span>
          <span className="font-heading text-2xl font-bold text-[#0B132B]">
            {formatCurrency(finalPrice)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-emerald-600 font-bold block">
            ✓ BIS Hallmarked
          </span>
          <span className="text-[10px] text-neutral-400">100% Certified Purity</span>
        </div>
      </div>
    </div>
  );
};

export default LivePriceBreakdown;
