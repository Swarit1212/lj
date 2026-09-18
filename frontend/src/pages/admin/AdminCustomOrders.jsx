import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import { formatCurrency } from "../../utils/formatCurrency";

const AdminCustomOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit/Quote Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quotePrice, setQuotePrice] = useState("");
  const [orderStatus, setOrderStatus] = useState("pending");
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get("/custom-orders/admin");
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load custom jewelry orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openQuoteModal = (order) => {
    setSelectedOrder(order);
    setQuotePrice(order.quotedPrice !== null && order.quotedPrice !== undefined ? order.quotedPrice : "");
    setOrderStatus(order.status);
    setAdminNotes(order.adminNotes || "");
    setIsModalOpen(true);
  };

  const handleUpdateQuote = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await API.put(`/custom-orders/admin/${selectedOrder._id}`, {
        status: orderStatus,
        quotedPrice: quotePrice === "" ? null : Number(quotePrice),
        adminNotes: adminNotes,
      });
      toast.success("Custom order updated successfully!");
      setIsModalOpen(false);
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to update custom order.");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">Pending Review</span>;
      case "quoted":
        return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">Quoted</span>;
      case "approved":
        return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">Approved</span>;
      case "in-production":
        return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">In Production</span>;
      case "completed":
        return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-green-50 text-green-700 border border-green-200">Completed</span>;
      case "cancelled":
        return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-neutral-100 text-neutral-600">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col justify-center items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
        <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Loading Custom Atelier Queue...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 font-sans">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-extrabold text-[#0B132B] tracking-tight">Custom Atelier requests</h1>
        <p className="text-xs text-neutral-500 mt-1.5 font-medium uppercase tracking-wider">
          Evaluate client-submitted sketches, quote estimated prices, update production workflow steps, and communicate directly with customers.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="py-20 bg-white border border-neutral-200 rounded-3xl text-center shadow-xs">
          <span className="text-4xl filter drop-shadow-sm block mb-4">👑</span>
          <h3 className="font-heading text-base font-bold text-[#0B132B]">Queue is Empty</h3>
          <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider mt-1.5">No custom designs have been uploaded yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50 text-neutral-400 font-extrabold uppercase tracking-wider">
                  <th className="p-4 font-semibold">Design Sketch</th>
                  <th className="p-4 font-semibold">Client Detail</th>
                  <th className="p-4 font-semibold">Specs</th>
                  <th className="p-4 font-semibold">Quote (Est)</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-sans">
                {orders.map((ord) => {
                  const cleanedPhone = ord.phone.replace(/[^0-9+]/g, "");
                  const whatsappLink = `https://wa.me/${cleanedPhone.startsWith("+") ? cleanedPhone.substring(1) : cleanedPhone}`;

                  return (
                    <tr key={ord._id} className="text-neutral-700 hover:bg-neutral-50/40 transition-colors">
                      {/* Image preview */}
                      <td className="p-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-neutral-100 bg-neutral-50 shadow-xs flex items-center justify-center">
                          <img
                            src={ord.designImageUrl.startsWith("http") ? ord.designImageUrl : `http://localhost:5000${ord.designImageUrl}`}
                            alt="Custom jewelry sketch"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://placehold.co/150x150/EBEBEB/B8960F?text=Sketch";
                            }}
                          />
                        </div>
                      </td>

                      {/* Customer contact */}
                      <td className="p-4">
                        <div className="font-bold text-[#0B132B]">{ord.user?.name || "Guest Account"}</div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">{ord.user?.email || "No email"}</div>
                        <div className="text-[10px] text-neutral-500 font-medium mt-1">📞 {ord.phone}</div>
                      </td>

                      {/* Jewelry Specs */}
                      <td className="p-4">
                        <div className="font-bold text-[#0B132B] uppercase tracking-wide">
                          {ord.material} ({ord.purity})
                        </div>
                        <div className="text-[10px] text-neutral-500 mt-0.5">Target weight: {ord.weight}g</div>
                        {ord.notes && (
                          <div className="text-[10px] text-neutral-400 truncate max-w-xs mt-1.5 italic" title={ord.notes}>
                            "{ord.notes}"
                          </div>
                        )}
                      </td>

                      {/* Pricing Quote */}
                      <td className="p-4 font-bold text-[#0B132B]">
                        {ord.quotedPrice !== null && ord.quotedPrice !== undefined ? (
                          <span className="font-semibold text-neutral-800">{formatCurrency(ord.quotedPrice)}</span>
                        ) : (
                          <span className="text-neutral-400 italic">Unquoted</span>
                        )}
                        {ord.adminNotes && (
                          <div className="text-[9px] font-normal text-neutral-400 max-w-[150px] truncate mt-0.5">
                            Notes: {ord.adminNotes}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-4">{getStatusBadge(ord.status)}</td>

                      {/* Action buttons */}
                      <td className="p-4 text-right space-y-1 sm:space-y-0 sm:space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openQuoteModal(ord)}
                          className="font-bold py-1.5 px-3 rounded-lg"
                        >
                          Quote / Update
                        </Button>
                        <a
                          href={whatsappLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-1.5 px-3 rounded-lg border border-emerald-200"
                          >
                            WhatsApp
                          </Button>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pricing & Status Modal */}
      {selectedOrder && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Quote custom request #${selectedOrder._id.substring(selectedOrder._id.length - 8).toUpperCase()}`}
        >
          <form onSubmit={handleUpdateQuote} className="space-y-5">
            {/* Short preview of client request details */}
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center gap-4">
              <img
                src={selectedOrder.designImageUrl.startsWith("http") ? selectedOrder.designImageUrl : `http://localhost:5000${selectedOrder.designImageUrl}`}
                className="w-14 h-14 object-cover rounded-xl border border-neutral-200"
                alt="Quick preview"
              />
              <div className="text-xs">
                <p className="font-bold text-[#0B132B] uppercase tracking-wide">{selectedOrder.material} ({selectedOrder.purity})</p>
                <p className="text-neutral-500 font-medium mt-0.5">Target weight: {selectedOrder.weight}g</p>
                <p className="text-neutral-400 mt-1 italic line-clamp-1">"{selectedOrder.notes}"</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Quote Price Input */}
              <Input
                label="Estimate Price Quote (INR)"
                type="number"
                placeholder="e.g. 95000"
                value={quotePrice}
                onChange={(e) => setQuotePrice(e.target.value)}
              />

              {/* Status Select */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Update Status
                </label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-md text-sm text-neutral-800 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200"
                >
                  <option value="pending">Pending Review</option>
                  <option value="quoted">Quoted</option>
                  <option value="approved">Approved / Ready to Pay</option>
                  <option value="in-production">In Production</option>
                  <option value="completed">Completed / Shipped</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Admin private notes */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1.5">
                Admin Notes (visible to customer)
              </label>
              <textarea
                rows="3"
                placeholder="e.g. 18K Yellow Gold with 0.5ct diamonds, custom lock mechanism included..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-md text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200"
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4 mt-6">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={updating}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminCustomOrders;
