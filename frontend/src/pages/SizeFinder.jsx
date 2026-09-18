import React, { useState } from "react";
import Button from "../components/common/Button";

// Indian & US Ring Size Chart lookup
// Standard diameters in millimeters
const ringSizeChart = [
  { diameter: 14.1, inSize: 6, usSize: 3 },
  { diameter: 14.5, inSize: 7, usSize: 3.5 },
  { diameter: 14.9, inSize: 8, usSize: 4 },
  { diameter: 15.3, inSize: 9, usSize: 4.5 },
  { diameter: 15.7, inSize: 10, usSize: 5 },
  { diameter: 16.1, inSize: 11, usSize: 5.5 },
  { diameter: 16.5, inSize: 12, usSize: 6 },
  { diameter: 16.9, inSize: 13, usSize: 6.5 },
  { diameter: 17.3, inSize: 14, usSize: 7 },
  { diameter: 17.7, inSize: 15, usSize: 7.5 },
  { diameter: 18.1, inSize: 16, usSize: 8 },
  { diameter: 18.5, inSize: 17, usSize: 8.5 },
  { diameter: 19.0, inSize: 18, usSize: 9 },
  { diameter: 19.4, inSize: 19, usSize: 9.5 },
  { diameter: 19.8, inSize: 20, usSize: 10 },
  { diameter: 20.2, inSize: 21, usSize: 10.5 },
  { diameter: 20.6, inSize: 22, usSize: 11 },
  { diameter: 21.0, inSize: 23, usSize: 11.5 },
  { diameter: 21.4, inSize: 24, usSize: 12 },
  { diameter: 21.8, inSize: 25, usSize: 12.5 },
  { diameter: 22.2, inSize: 26, usSize: 13 },
];

const SizeFinder = () => {
  const [step, setStep] = useState("calibrate"); // calibrate, measure

  // Calibration State
  // Standard card width is 85.6 mm.
  // We represent the card as a rectangle. The user slides to match physical card size.
  const [cardWidthPx, setCardWidthPx] = useState(300); // initial default width in px
  const mmPerPixel = 85.6 / cardWidthPx;

  // Measurement State (Circle Diameter in Pixels)
  const [circleDiameterPx, setCircleDiameterPx] = useState(65);

  const physicalDiameterMm = circleDiameterPx * mmPerPixel;

  // Find closest size in chart
  const getClosestSize = () => {
    let closest = ringSizeChart[0];
    let minDiff = Math.abs(physicalDiameterMm - closest.diameter);

    for (let i = 1; i < ringSizeChart.length; i++) {
      const diff = Math.abs(physicalDiameterMm - ringSizeChart[i].diameter);
      if (diff < minDiff) {
        minDiff = diff;
        closest = ringSizeChart[i];
      }
    }
    return closest;
  };

  const closestSize = getClosestSize();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="font-heading text-3xl font-extrabold text-[#0B132B] tracking-tight">Atelier Size Finder</h1>
        <p className="text-xs text-neutral-500 mt-2 font-medium uppercase tracking-wider">
          A high-precision calibration tool to find your exact ring size using any standard card on screen.
        </p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-10 shadow-xs max-w-2xl mx-auto">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-5 mb-8">
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === "calibrate" ? "bg-[#D4AF37] text-[#0B132B]" : "bg-neutral-100 text-neutral-400"
            }`}>
              1
            </span>
            <span className={`text-xs font-bold uppercase tracking-wider ${
              step === "calibrate" ? "text-[#0B132B]" : "text-neutral-400"
            }`}>
              Calibrate Screen
            </span>
          </div>
          <div className="h-[2px] bg-neutral-100 flex-1 mx-4" />
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === "measure" ? "bg-[#D4AF37] text-[#0B132B]" : "bg-neutral-100 text-neutral-400"
            }`}>
              2
            </span>
            <span className={`text-xs font-bold uppercase tracking-wider ${
              step === "measure" ? "text-[#0B132B]" : "text-neutral-400"
            }`}>
              Measure Ring
            </span>
          </div>
        </div>

        {/* STEP 1: Calibrate Screen */}
        {step === "calibrate" && (
          <div className="space-y-6 flex flex-col items-center">
            <div className="text-center max-w-md">
              <h3 className="font-heading text-base font-bold text-[#0B132B] mb-2">Screen Calibration</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Place any standard card (credit card, driver's license, or transit card) flat against your screen. Adjust the slider until the golden card on screen matches the physical card's width.
              </p>
            </div>

            {/* Simulated Card on Screen */}
            <div
              style={{ width: `${cardWidthPx}px`, height: `${cardWidthPx * (53.98 / 85.6)}px` }}
              className="border-3 border-[#D4AF37] bg-amber-50/10 rounded-xl relative flex flex-col items-center justify-center transition-all shadow-md select-none"
            >
              <div className="w-12 h-8 bg-neutral-200/50 border border-neutral-300 rounded-md absolute top-4 left-4" />
              <span className="font-heading text-[#D4AF37] text-[10px] font-extrabold uppercase tracking-widest absolute bottom-4 right-4">
                Atelier Card
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                Match Physical Card Width
              </span>
            </div>

            {/* Slider */}
            <div className="w-full max-w-sm space-y-3 pt-4">
              <input
                type="range"
                min="180"
                max="500"
                value={cardWidthPx}
                onChange={(e) => setCardWidthPx(Number(e.target.value))}
                className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
              />
              <div className="flex justify-between text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                <span>Smaller Screen</span>
                <span>Zoom</span>
                <span>Larger Screen</span>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={() => setStep("measure")}
              className="w-full max-w-xs font-bold uppercase tracking-wider text-xs py-3 shadow"
            >
              Next: Measure Ring Size
            </Button>
          </div>
        )}

        {/* STEP 2: Measure Ring */}
        {step === "measure" && (
          <div className="space-y-6 flex flex-col items-center">
            <div className="text-center max-w-md">
              <h3 className="font-heading text-base font-bold text-[#0B132B] mb-2">Measure Ring Diameter</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Place a ring that fits you well flat on your screen. Adjust the slider until the outer edge of the golden circle matches the inner edge of your physical ring.
              </p>
            </div>

            {/* Circular measurement ring */}
            <div className="h-56 flex items-center justify-center bg-neutral-50/50 border border-neutral-200 rounded-2xl w-full max-w-md">
              <div
                style={{ width: `${circleDiameterPx}px`, height: `${circleDiameterPx}px` }}
                className="rounded-full border-4 border-[#D4AF37] bg-white flex items-center justify-center relative shadow-md transition-all duration-75"
              >
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-neutral-300 border-dashed" />
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-neutral-300 border-dashed" />
                <span className="absolute -bottom-6 font-mono text-[10px] text-neutral-500 bg-white px-2 py-0.5 border rounded-full font-bold shadow-xs">
                  {physicalDiameterMm.toFixed(1)} mm
                </span>
              </div>
            </div>

            {/* Slider */}
            <div className="w-full max-w-sm space-y-3 pt-4">
              <input
                type="range"
                min="35"
                max="120"
                value={circleDiameterPx}
                onChange={(e) => setCircleDiameterPx(Number(e.target.value))}
                className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
              />
              <div className="flex justify-between text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                <span>Smaller Diameter</span>
                <span>Size</span>
                <span>Larger Diameter</span>
              </div>
            </div>

            {/* Results Grid */}
            <div className="w-full max-w-md bg-neutral-50 border border-neutral-100 rounded-2xl p-5 grid grid-cols-3 text-center divide-x divide-neutral-200/80">
              <div>
                <span className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                  Diameter
                </span>
                <span className="font-heading text-lg font-extrabold text-[#0B132B]">
                  {physicalDiameterMm.toFixed(1)} <span className="text-[10px] font-medium">mm</span>
                </span>
              </div>
              <div>
                <span className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                  Indian Size
                </span>
                <span className="font-heading text-lg font-extrabold text-[#D4AF37]">
                  {closestSize.inSize}
                </span>
              </div>
              <div>
                <span className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                  US / Canada
                </span>
                <span className="font-heading text-lg font-extrabold text-[#0B132B]">
                  {closestSize.usSize}
                </span>
              </div>
            </div>

            <div className="flex gap-4 w-full max-w-md pt-2">
              <Button
                variant="outline"
                onClick={() => setStep("calibrate")}
                className="flex-1 font-bold uppercase tracking-wider text-xs py-3"
              >
                Back to Calibrate
              </Button>
              <a href="/shop" className="flex-grow">
                <Button
                  variant="primary"
                  className="w-full font-bold uppercase tracking-wider text-xs py-3 shadow"
                >
                  Shop collections
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SizeFinder;
