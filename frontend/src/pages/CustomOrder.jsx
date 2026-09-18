import React, { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { formatCurrency } from "../utils/formatCurrency";

const CustomOrder = () => {
  const [activeTab, setActiveTab] = useState("submit");
  const [myOrders, setMyOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Form State
  const [phone, setPhone] = useState("");
  const [material, setMaterial] = useState("gold");
  const [purity, setPurity] = useState("22K");
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMyOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await API.get("/custom-orders/my");
      setMyOrders(res.data || []);
    } catch (err) {
      console.error("Error fetching custom orders:", err);
      toast.error("Failed to load your request history.");
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      fetchMyOrders();
    }
  }, [activeTab]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be under 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be under 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please drop an image file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please upload a design sketch or image.");
      return;
    }
    if (!phone || !weight) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("material", material);
    formData.append("purity", purity);
    formData.append("weight", weight);
    formData.append("notes", notes);
    formData.append("image", imageFile);

    try {
      await API.post("/custom-orders", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Custom design request submitted successfully!");
      // Reset form
      setPhone("");
      setMaterial("gold");
      setPurity("22K");
      setWeight("");
      setNotes("");
      setImageFile(null);
      setImagePreview(null);
      // View history
      setActiveTab("history");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Status Badge styling helper
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase rounded-full tracking-wider">Pending Review</span>;
      case "quoted":
        return <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase rounded-full tracking-wider">Quoted</span>;
      case "approved":
        return <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase rounded-full tracking-wider">Approved</span>;
      case "in-production":
        return <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold uppercase rounded-full tracking-wider">In Production</span>;
      case "completed":
        return <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold uppercase rounded-full tracking-wider">Completed</span>;
      case "cancelled":
        return <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold uppercase rounded-full tracking-wider">Cancelled</span>;
      default:
        return <span className="px-3 py-1 bg-neutral-100 text-neutral-600 text-[10px] font-bold uppercase rounded-full tracking-wider">{status}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-in">
        <h1 className="font-heading text-4xl font-extrabold text-royal-navy tracking-tight">Atelier Custom Designs</h1>
        <p className="text-neutral-400 text-xs mt-3 leading-relaxed font-sans font-light">
          Bring your dreams to life. Upload your own sketches, reference photos, or designs. Our master craftsmen will evaluate your specifications and provide a custom price quote.
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="flex bg-neutral-100/70 p-1.5 rounded-xl max-w-sm mx-auto mb-10 border border-neutral-200/50">
        <button
          onClick={() => setActiveTab("submit")}
          className={`flex-1 py-2.5 font-bold text-[10px] uppercase tracking-widest rounded-lg transition-all cursor-pointer ${
            activeTab === "submit"
              ? "bg-white text-gold-500 shadow-xs font-extrabold border border-gold-500/5"
              : "text-neutral-500 hover:text-royal-navy"
          }`}
        >
          Submit Design
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-2.5 font-bold text-[10px] uppercase tracking-widest rounded-lg transition-all cursor-pointer ${
            activeTab === "history"
              ? "bg-white text-gold-500 shadow-xs font-extrabold border border-gold-500/5"
              : "text-neutral-500 hover:text-royal-navy"
          }`}
        >
          Request History
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "submit" ? (
        <div className="bg-white border border-gold-500/10 rounded-3xl p-6 sm:p-10 shadow-xs max-w-4xl mx-auto animate-fade-in-up">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Design Upload Preview Panel */}
            <div className="md:col-span-5 flex flex-col items-center">
              <span className="block text-[9px] font-bold uppercase tracking-widest text-neutral-400 self-start mb-2">
                1. Upload Sketch / Image
              </span>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`w-full aspect-square border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-500 relative bg-[#FAF9F6] ${
                  imagePreview ? "border-solid border-gold-500" : "border-neutral-200 hover:border-gold-500/40 hover:bg-gold-50/5"
                }`}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-3 right-3 bg-royal-navy hover:bg-royal-navy/90 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs transition-colors shadow-lg cursor-pointer"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center p-6 text-center cursor-pointer w-full h-full">
                    <span className="text-4xl mb-3 filter drop-shadow-xs">✨</span>
                    <span className="text-[10px] font-bold text-royal-navy uppercase tracking-widest">Drag & Drop Image</span>
                    <span className="text-[9px] text-neutral-400 font-bold mt-1.5 uppercase tracking-wider">or click to browse</span>
                    <span className="text-[9px] text-neutral-400 mt-4 font-semibold uppercase tracking-widest leading-normal">
                      PNG, JPG or WEBP (Max 5MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Specifications Form Panel */}
            <div className="md:col-span-7 space-y-5">
              <span className="block text-[9px] font-bold uppercase tracking-widest text-neutral-400">
                2. Design Specifications
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Material */}
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5">
                    Material <span className="text-gold-500">*</span>
                  </label>
                  <select
                    value={material}
                    onChange={(e) => {
                      setMaterial(e.target.value);
                      if (e.target.value === "gold") setPurity("22K");
                      else if (e.target.value === "silver") setPurity("92.5 Sterling");
                      else setPurity("");
                    }}
                    className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/10 cursor-pointer shadow-xs transition-all"
                  >
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                    <option value="other">Other Material</option>
                  </select>
                </div>

                {/* Purity */}
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5">
                    Purity / Carats
                  </label>
                  {material === "gold" ? (
                    <select
                      value={purity}
                      onChange={(e) => setPurity(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/10 cursor-pointer shadow-xs transition-all"
                    >
                      <option value="24K">24K (Pure Gold)</option>
                      <option value="22K">22K (Standard Jewelry)</option>
                      <option value="18K">18K (Premium Setting)</option>
                      <option value="14K">14K</option>
                    </select>
                  ) : material === "silver" ? (
                    <select
                      value={purity}
                      onChange={(e) => setPurity(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/10 cursor-pointer shadow-xs transition-all"
                    >
                      <option value="99.9 Fine">99.9% Fine Silver</option>
                      <option value="92.5 Sterling">92.5% Sterling Silver</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="e.g. Platinum 950"
                      value={purity}
                      onChange={(e) => setPurity(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/10 shadow-xs transition-all"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Weight */}
                <Input
                  label="Target Weight (in grams)"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 12.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />

                {/* Contact Phone */}
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="e.g. +91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              {/* Special Notes */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5">
                  Detailed Notes / Instructions
                </label>
                <textarea
                  rows="4"
                  placeholder="Tell us about the size, dimensions, diamond accents, lock type, engraving details, or any other preferences..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/10 focus:bg-white transition-all shadow-xs"
                ></textarea>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full font-bold uppercase tracking-widest text-[10px] py-3.5 shadow-md shadow-gold-500/5 mt-2 rounded-xl cursor-pointer"
                isLoading={isSubmitting}
              >
                Submit Design Request
              </Button>
            </div>

          </form>
        </div>
      ) : (
        /* History Tab Contents */
        <div className="max-w-5xl mx-auto">
          {loadingOrders ? (
            <div className="py-20 flex flex-col justify-center items-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gold-500"></div>
              <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest animate-pulse">
                Fetching archives...
              </p>
            </div>
          ) : myOrders.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gold-500/10 rounded-3xl p-10 max-w-lg mx-auto shadow-xs">
              <span className="text-4xl filter drop-shadow-xs block mb-4">💎</span>
              <h3 className="font-heading text-lg font-bold text-royal-navy mb-2">No Custom Designs Found</h3>
              <p className="text-neutral-400 text-xs leading-relaxed max-w-xs mx-auto mb-6 font-sans">
                You haven't submitted any custom jewelry design requests yet. Go to the "Submit Design" tab to send your first sketch.
              </p>
              <Button onClick={() => setActiveTab("submit")} variant="outline" size="sm" className="!text-[9px] font-bold tracking-widest py-2 px-4 rounded-xl">
                Create a Request
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myOrders.map((ord) => (
                <div key={ord._id} className="bg-white border border-gold-500/10 hover:border-gold-500/35 rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row gap-5">
                  {/* Image Preview */}
                  <div className="w-full sm:w-1/3 aspect-square rounded-2xl overflow-hidden border border-neutral-100 bg-[#FAF9F6]">
                    <img
                      src={ord.designImageUrl.startsWith("http") ? ord.designImageUrl : `http://localhost:5000${ord.designImageUrl}`}
                      alt="Custom Design"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/400x400/EBEBEB/B8960F?text=Custom+Design";
                      }}
                    />
                  </div>

                  {/* Design details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3.5">
                        <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                          ID: #{ord._id.substring(ord._id.length - 8).toUpperCase()}
                        </span>
                        {getStatusBadge(ord.status)}
                      </div>

                      <h4 className="font-heading text-sm font-bold text-royal-navy uppercase tracking-wide">
                        {ord.purity} {ord.material}
                      </h4>
                      <p className="text-neutral-400 text-xs mt-1.5 font-sans font-medium">
                        Target Weight: <strong className="text-royal-navy font-bold">{ord.weight} g</strong>
                      </p>

                      {ord.notes && (
                        <p className="text-neutral-400 text-[11px] leading-relaxed mt-2.5 line-clamp-2 italic font-sans font-light">
                          "{ord.notes}"
                        </p>
                      )}

                      {/* Admin Quotation */}
                      {ord.status !== "pending" && ord.quotedPrice && (
                        <div className="mt-4 p-3.5 bg-gold-50/15 border border-gold-500/15 rounded-2xl">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-gold-500 block">
                            ESTIMATED PRICE QUOTE
                          </span>
                          <span className="font-heading text-base font-black text-royal-navy mt-0.5 block">
                            {formatCurrency(ord.quotedPrice)}
                          </span>
                          {ord.adminNotes && (
                            <p className="text-[10px] text-neutral-400 mt-1.5 leading-relaxed italic border-t border-neutral-100 pt-1.5 font-sans font-light">
                              Admin: {ord.adminNotes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-[9px] text-neutral-400 mt-4 text-right font-bold uppercase tracking-wider">
                      Submitted: {new Date(ord.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomOrder;
