import React from "react";

// Product Card Skeleton for Shop page grid
export const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden shadow-sm p-5 space-y-4 animate-pulse flex flex-col h-full justify-between">
    <div className="space-y-4">
      {/* Image box */}
      <div className="aspect-square bg-neutral-200 rounded-lg w-full" />
      {/* Category badge */}
      <div className="h-3 bg-neutral-200 rounded w-1/4" />
      {/* Title */}
      <div className="h-5 bg-neutral-200 rounded w-3/4" />
    </div>
    {/* Footer pricing & button */}
    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between mt-4">
      <div className="space-y-1 flex-1">
        <div className="h-2 bg-neutral-200 rounded w-1/3" />
        <div className="h-5 bg-neutral-200 rounded w-1/2" />
      </div>
      <div className="h-8 bg-neutral-200 rounded w-16" />
    </div>
  </div>
);

// Product Detail Skeleton
export const SkeletonProductDetail = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      {/* Left side image preview */}
      <div className="aspect-square bg-neutral-200 rounded-2xl w-full" />
      
      {/* Right side info panel */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="h-4 bg-neutral-200 rounded w-1/4" />
          <div className="h-10 bg-neutral-200 rounded w-3/4" />
          <div className="h-6 bg-neutral-200 rounded w-full mt-2" />
          <div className="h-6 bg-neutral-200 rounded w-5/6" />
        </div>
        
        {/* Pricing breakdown box */}
        <div className="h-36 bg-neutral-150 border border-neutral-200 rounded-2xl w-full p-6 space-y-3">
          <div className="h-4 bg-neutral-200 rounded w-1/3" />
          <div className="h-8 bg-neutral-200 rounded w-1/2" />
          <div className="h-4 bg-neutral-200 rounded w-full" />
        </div>

        {/* Quantity and CTA Buttons */}
        <div className="flex items-center gap-6 pt-4 border-t border-neutral-100">
          <div className="h-10 bg-neutral-200 rounded w-28" />
          <div className="h-10 bg-neutral-200 rounded flex-1" />
        </div>

        {/* Specs tab panel */}
        <div className="h-32 bg-neutral-100 rounded-xl w-full" />
      </div>
    </div>
  </div>
);

// Shopping Bag/Cart Skeleton
export const SkeletonCart = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-6">
    <div className="h-10 bg-neutral-200 rounded w-1/4 mb-8" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Left items details */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-6">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row gap-6 py-6 first:pt-0 last:pb-0 border-b border-neutral-100 last:border-0 items-start sm:items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 bg-neutral-200 rounded-xl" />
                <div className="space-y-2">
                  <div className="h-4 bg-neutral-200 rounded w-36" />
                  <div className="h-3 bg-neutral-200 rounded w-24" />
                  <div className="h-3 bg-neutral-200 rounded w-16 mt-2" />
                </div>
              </div>
              <div className="flex items-center gap-8 justify-between w-full sm:w-auto">
                <div className="h-8 bg-neutral-200 rounded w-24" />
                <div className="h-6 bg-neutral-200 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Right bill card summary */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 h-80 space-y-6">
        <div className="h-6 bg-neutral-200 rounded w-1/2 border-b pb-4" />
        <div className="space-y-3">
          <div className="flex justify-between"><div className="h-4 bg-neutral-200 rounded w-1/3" /><div className="h-4 bg-neutral-200 rounded w-1/4" /></div>
          <div className="flex justify-between"><div className="h-4 bg-neutral-200 rounded w-1/4" /><div className="h-4 bg-neutral-200 rounded w-1/4" /></div>
          <div className="flex justify-between"><div className="h-4 bg-neutral-200 rounded w-1/2" /><div className="h-4 bg-neutral-200 rounded w-1/4" /></div>
        </div>
        <div className="border-t pt-4 h-12 bg-neutral-150 rounded" />
        <div className="h-10 bg-neutral-200 rounded w-full" />
      </div>
    </div>
  </div>
);

// Order List History Skeleton
export const SkeletonOrders = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-6">
    <div className="flex justify-between items-center mb-8">
      <div className="h-8 bg-neutral-200 rounded w-1/3" />
      <div className="h-8 bg-neutral-200 rounded w-24" />
    </div>
    {[...Array(3)].map((_, idx) => (
      <div key={idx} className="bg-white border border-neutral-200 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-3 flex-1">
          <div className="flex gap-2">
            <div className="h-4 bg-neutral-200 rounded w-20" />
            <div className="h-4 bg-neutral-200 rounded w-16" />
          </div>
          <div className="h-3 bg-neutral-200 rounded w-32" />
          <div className="flex gap-2"><div className="w-8 h-8 bg-neutral-200 rounded" /><div className="w-8 h-8 bg-neutral-200 rounded" /></div>
        </div>
        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
          <div className="h-6 bg-neutral-200 rounded w-20" />
          <div className="h-8 bg-neutral-200 rounded w-24" />
        </div>
      </div>
    ))}
  </div>
);

// Single Order Detail Skeleton
export const SkeletonOrderDetail = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-8">
    <div className="flex items-center justify-between border-b pb-4">
      <div className="space-y-2">
        <div className="h-6 bg-neutral-200 rounded w-36" />
        <div className="h-3 bg-neutral-200 rounded w-48" />
      </div>
      <div className="h-8 bg-neutral-200 rounded w-24" />
    </div>

    {/* Order Tracking Progress bar */}
    <div className="bg-white border border-neutral-200 rounded-xl p-6 h-20 flex justify-between items-center animate-pulse">
      <div className="h-4 bg-neutral-200 rounded w-full" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Items card */}
      <div className="md:col-span-2 bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
        <div className="h-6 bg-neutral-200 rounded w-1/3" />
        <div className="space-y-4">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="flex gap-3 items-center justify-between py-4 border-b border-neutral-100 last:border-0">
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 bg-neutral-200 rounded-lg" />
                <div className="space-y-1">
                  <div className="h-4 bg-neutral-200 rounded w-32" />
                  <div className="h-3 bg-neutral-200 rounded w-20" />
                </div>
              </div>
              <div className="h-4 bg-neutral-200 rounded w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Address & pricing details column */}
      <div className="space-y-6">
        <div className="bg-white border border-neutral-200 rounded-xl p-6 h-36 space-y-3">
          <div className="h-5 bg-neutral-200 rounded w-1/2" />
          <div className="h-3 bg-neutral-200 rounded w-3/4" />
          <div className="h-3 bg-neutral-200 rounded w-2/3" />
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-6 h-36 space-y-3">
          <div className="h-5 bg-neutral-200 rounded w-1/2" />
          <div className="h-3 bg-neutral-200 rounded w-3/4" />
          <div className="h-3 bg-neutral-200 rounded w-2/3" />
        </div>
      </div>
    </div>
  </div>
);

// Profile and Account Forms Skeleton
export const SkeletonProfile = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-10">
    <div className="bg-[#0B132B] h-32 rounded-2xl flex items-center justify-between p-8" />
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="space-y-2"><div className="h-10 bg-neutral-200 rounded-xl" /><div className="h-10 bg-neutral-200 rounded-xl" /><div className="h-10 bg-neutral-200 rounded-xl" /></div>
      <div className="lg:col-span-3 bg-white border border-neutral-200 rounded-2xl p-6 space-y-6">
        <div className="h-6 bg-neutral-200 rounded w-1/4" />
        <div className="space-y-4 max-w-md">
          <div className="h-14 bg-neutral-200 rounded-lg" />
          <div className="h-14 bg-neutral-200 rounded-lg" />
          <div className="h-10 bg-neutral-200 rounded w-32" />
        </div>
      </div>
    </div>
  </div>
);
