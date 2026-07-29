import React from "react";
import { useMetalRates } from "../../context/MetalRateContext";
import { formatCurrency } from "../../utils/formatCurrency";

export const LivePriceTicker = () => {
  const { rates } = useMetalRates();

  return (
    <div className="bg-[#0B132B] text-white py-1.5 px-4 text-xs font-medium border-b border-[#D4AF37]/20 flex items-center justify-between">
      <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap scrollbar-none max-w-7xl mx-auto w-full justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[#D4AF37] font-semibold tracking-wider uppercase">Live Market Rates:</span>
        </div>

        <div className="flex items-center gap-6 text-neutral-300">
          <div>
            <span className="text-neutral-400">Gold 24K: </span>
            <span className="text-white font-semibold">{formatCurrency(rates.gold24k)}/g</span>
          </div>
          <span className="text-neutral-600">|</span>
          <div>
            <span className="text-neutral-400">Gold 22K: </span>
            <span className="text-white font-semibold">{formatCurrency(rates.gold22k)}/g</span>
          </div>
          <span className="text-neutral-600">|</span>
          <div>
            <span className="text-neutral-400">Gold 18K: </span>
            <span className="text-white font-semibold">{formatCurrency(rates.gold18k)}/g</span>
          </div>
          <span className="text-neutral-600">|</span>
          <div>
            <span className="text-neutral-400">925 Silver: </span>
            <span className="text-white font-semibold">{formatCurrency(rates.silver)}/g</span>
          </div>
        </div>

        <div className="hidden lg:block text-neutral-400 text-[11px]">
          Updated: {rates.lastUpdated || "Just now"}
        </div>
      </div>
    </div>
  );
};

export default LivePriceTicker;
