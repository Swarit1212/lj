import React, { useState } from "react";
import { useMetalRates } from "../context/MetalRateContext";
import { formatCurrency } from "../utils/formatCurrency";
import Button from "../components/common/Button";

const PriceCalculator = () => {
  const { rates, isLoading, refreshRates } = useMetalRates();
  
  // Selection States
  const [metalType, setMetalType] = useState("gold"); // gold or silver
  const [goldPurity, setGoldPurity] = useState("22k"); // 24k, 22k, 18k
  const [weight, setWeight] = useState(10); // default 10 grams
  const [makingChargeType, setMakingChargeType] = useState("percent"); // percent or perGram
  const [makingChargeVal, setMakingChargeVal] = useState(12); // default 12% or Rs. 600 per gram

  // Get current base rate
  const getCurrentRate = () => {
    if (metalType === "silver") {
      return rates.silver || 88;
    }
    switch (goldPurity) {
      case "24k":
        return rates.gold24k || 7250;
      case "18k":
        return rates.gold18k || 5440;
      case "22k":
      default:
        return rates.gold22k || 6650;
    }
  };

  const ratePerGram = getCurrentRate();
  const metalValue = weight * ratePerGram;

  // Making charges
  const makingCharges =
    makingChargeType === "percent"
      ? metalValue * (makingChargeVal / 100)
      : weight * makingChargeVal;

  const subtotal = metalValue + makingCharges;
  const gst = subtotal * 0.03; // Standard 3% GST on jewelry in India
  const grandTotal = subtotal + gst;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="font-heading text-4xl font-extrabold text-[#0B132B] tracking-tight">
          Live Pricing Calculator
        </h1>
        <p className="text-neutral-500 text-sm mt-3 leading-relaxed">
          Simulate and estimate the value of your custom or catalog jewelry pieces instantly based on live, verified gold and silver market rates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Interactive Controls */}
        <div className="lg:col-span-7 bg-white border border-gold-500/10 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <h3 className="font-heading text-lg font-bold text-royal-navy">Configure Specifications</h3>
            <button
              onClick={refreshRates}
              disabled={isLoading}
              className="text-[9px] text-gold-500 hover:text-gold-600 font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              🔄 {isLoading ? "Refreshing..." : "Refresh Live Rates"}
            </button>
          </div>

          {/* 1. Metal Selection */}
          <div className="space-y-3">
            <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400">
              1. Select Precious Metal
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setMetalType("gold");
                  setMakingChargeVal(12);
                }}
                className={`py-4.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                  metalType === "gold"
                    ? "border-gold-500 bg-gold-50/15 text-royal-navy ring-1 ring-gold-500/40 shadow-xs"
                    : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300"
                }`}
              >
                <span className="text-2xl filter drop-shadow-xs">👑</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Gold Rate</span>
                <span className="text-[9px] font-bold text-gold-500 mt-0.5">
                  Live: {formatCurrency(rates.gold22k)}/g (22K)
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMetalType("silver");
                  setMakingChargeVal(8);
                }}
                className={`py-4.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                  metalType === "silver"
                    ? "border-indigo-400 bg-indigo-50/5 text-royal-navy ring-1 ring-indigo-400/40 shadow-xs"
                    : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300"
                }`}
              >
                <span className="text-2xl filter drop-shadow-xs">🥈</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Silver Rate</span>
                <span className="text-[9px] font-bold text-neutral-500 mt-0.5">
                  Live: {formatCurrency(rates.silver)}/g
                </span>
              </button>
            </div>
          </div>

          {/* 2. Purity Selection (Gold Only) */}
          {metalType === "gold" && (
            <div className="space-y-3 animate-fadeIn">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                2. Gold Purity / Karat
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "24K (Pure)", val: "24k", rate: rates.gold24k },
                  { label: "22K (Standard)", val: "22k", rate: rates.gold22k },
                  { label: "18K (Jewelry)", val: "18k", rate: rates.gold18k },
                ].map((p) => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => setGoldPurity(p.val)}
                    className={`py-3 px-2 rounded-xl border text-center transition-all text-[10px] font-bold uppercase tracking-wider flex flex-col items-center justify-center cursor-pointer ${
                      goldPurity === p.val
                        ? "border-gold-500 bg-white text-royal-navy shadow-sm ring-1 ring-gold-500/50"
                        : "border-neutral-200 bg-neutral-50/30 text-neutral-500 hover:bg-neutral-50"
                    }`}
                  >
                    <span>{p.label}</span>
                    <span className="text-[9px] font-normal text-neutral-400 mt-1">
                      {formatCurrency(p.rate)}/g
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Weight Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                3. Metal Weight (Grams)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Math.max(0.1, Number(e.target.value)))}
                  className="w-16 px-2 py-1 text-center font-bold border border-neutral-200 rounded-lg focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/10 text-xs"
                />
                <span className="font-bold text-neutral-500 text-xs">g</span>
              </div>
            </div>
            <input
              type="range"
              min="0.5"
              max="150"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-gold-500"
            />
            <div className="flex justify-between text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
              <span>0.5 g</span>
              <span>75 g</span>
              <span>150 g</span>
            </div>
          </div>

          {/* 4. Making Charges */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                4. Making Charges Mode
              </label>
              <div className="flex bg-neutral-100 rounded-xl p-1 border border-neutral-200/50 text-[9px] font-bold uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => {
                    setMakingChargeType("percent");
                    setMakingChargeVal(metalType === "gold" ? 12 : 8);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    makingChargeType === "percent"
                      ? "bg-white text-royal-navy shadow-xs font-extrabold"
                      : "text-neutral-500 hover:text-black"
                  }`}
                >
                  Percentage (%)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMakingChargeType("flat");
                    setMakingChargeVal(metalType === "gold" ? 600 : 40);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    makingChargeType === "flat"
                      ? "bg-white text-royal-navy shadow-xs font-extrabold"
                      : "text-neutral-500 hover:text-black"
                  }`}
                >
                  Flat / Gram
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500 font-semibold text-xs">
                  {makingChargeType === "percent" ? "Making Charge Percentage" : "Flat Rate per Gram"}
                </span>
                <span className="font-bold text-royal-navy text-xs">
                  {makingChargeType === "percent" ? `${makingChargeVal}%` : `${formatCurrency(makingChargeVal)}/g`}
                </span>
              </div>
              <input
                type="range"
                min={makingChargeType === "percent" ? "5" : "50"}
                max={makingChargeType === "percent" ? "30" : "2000"}
                step={makingChargeType === "percent" ? "0.5" : "10"}
                value={makingChargeVal}
                onChange={(e) => setMakingChargeVal(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-gold-500"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Sleek Pricing Breakdown Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#050B1A] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gold-500/20 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-gold-500/5 blur-2xl" />
            <div className="relative z-10">
              <span className="text-[9px] text-gold-500 font-bold uppercase tracking-widest block mb-1">
                Estimated Valuation Summary
              </span>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-white mb-6">
                Total Price Estimate
              </h2>

              {/* Price list items */}
              <div className="space-y-4 text-xs font-sans">
                {/* Rate detail */}
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-neutral-400">Selected Rate ({metalType === "gold" ? goldPurity.toUpperCase() : "Silver"})</span>
                  <span className="font-bold text-white">{formatCurrency(ratePerGram)}/g</span>
                </div>

                {/* Base Metal Value */}
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-neutral-400">Base Metal Value ({weight}g)</span>
                  <span className="font-semibold text-white">{formatCurrency(metalValue)}</span>
                </div>

                {/* Making Charges */}
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-neutral-400 font-sans">
                    Making Charges ({makingChargeType === "percent" ? `${makingChargeVal}%` : `Rs. ${makingChargeVal}/g`})
                  </span>
                  <span className="font-semibold text-gold-200/90">{formatCurrency(makingCharges)}</span>
                </div>

                {/* Taxes GST */}
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-neutral-400 font-sans">Government GST (3%)</span>
                  <span className="font-semibold text-white">{formatCurrency(gst)}</span>
                </div>

                {/* grand total */}
                <div className="flex justify-between pt-4 items-end">
                  <span className="text-gold-500 text-[10px] font-bold uppercase tracking-widest">
                    Estimated Total
                  </span>
                  <span className="font-heading text-3xl font-bold text-white leading-none">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Note and action */}
            <div className="mt-8 border-t border-white/10 pt-6 space-y-4 relative z-10">
              <p className="text-[10px] text-neutral-400 leading-normal italic text-center font-sans">
                * This calculator is for estimation purposes. Exact final quotes depend on design intricacy, final weight variants, and stone settings.
              </p>
              <a href="/custom-designs" className="block w-full">
                <Button
                  variant="primary"
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-royal-navy font-bold text-[10px] uppercase tracking-wider py-3.5 rounded-xl hover:brightness-105 active:scale-[0.98] transition-all shadow-md shadow-gold-500/10 border-0"
                >
                  Order Custom Design
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCalculator;
