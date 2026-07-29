import React, { useState, useEffect } from "react";
import API from "../../api/axios.js";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import Modal from "../../components/common/Modal.jsx";
import { formatCurrency } from "../../utils/formatCurrency.js";

const AdminProducts = () => {
  const [material, setMaterial] = useState("gold");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form Fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Rings");
  const [wearingType, setWearingType] = useState("Unisex");
  const [purity, setPurity] = useState(22);
  const [weight, setWeight] = useState("");
  const [makingCharge, setMakingCharge] = useState("");
  const [makingChargeType, setMakingChargeType] = useState("perGram");
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/products?material=${material}&limit=100`);
      setProducts(res.data?.allProducts || res.data || []);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [material]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setCategory("Rings");
    setWearingType("Unisex");
    setPurity(material === "gold" ? 22 : 925);
    setWeight("");
    setMakingCharge("");
    setMakingChargeType("perGram");
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    setName(p.name || "");
    setDescription(p.description || "");
    setCategory(p.category || "Rings");
    setWearingType(p.wearingType || "Unisex");
    setPurity(p.purity || (material === "gold" ? 22 : 925));
    setWeight(p.weight || "");
    setMakingCharge(p.makingCharge || "");
    setMakingChargeType(p.makingChargeType || "perGram");
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you absolutely sure you want to delete this jewelry piece? This action is permanent.")) return;
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("material", material);
    formData.append("category", category);
    formData.append("wearingType", wearingType);
    formData.append("purity", purity);
    formData.append("weight", weight);
    formData.append("makingCharge", makingCharge);
    formData.append("makingChargeType", makingChargeType);
    
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await API.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to save product details. Check validations.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-[#0B132B] tracking-tight">Products Catalog</h1>
          <p className="text-xs text-neutral-500 mt-1.5 font-medium uppercase tracking-wider">
            Manage, edit, and create certified gold and silver jewelry models.
          </p>
        </div>
        <Button variant="primary" onClick={handleOpenAddModal} className="font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-md">
          + Create Masterpiece
        </Button>
      </div>

      {/* Catalog Tabs Toggle */}
      <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-neutral-200 shadow-xs max-w-xs">
        <button
          onClick={() => setMaterial("gold")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl uppercase tracking-wider transition-all duration-200 ${
            material === "gold"
              ? "bg-[#D4AF37] text-white shadow-md shadow-[#D4AF37]/10"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          Gold Registry
        </button>
        <button
          onClick={() => setMaterial("silver")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl uppercase tracking-wider transition-all duration-200 ${
            material === "silver"
              ? "bg-[#0B132B] text-[#D4AF37] shadow-md shadow-[#0B132B]/10"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          Silver Registry
        </button>
      </div>

      {/* Table Data */}
      {loading ? (
        <div className="py-20 text-center animate-pulse text-neutral-400 font-bold uppercase tracking-wider text-xs">
          Syncing Catalog inventory...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white border rounded-2xl text-neutral-400 font-bold uppercase tracking-wider text-xs">
          No catalog assets found. Create one.
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/50 text-neutral-500 font-extrabold uppercase tracking-wider">
                  <th className="p-4">Asset</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-center">Weight</th>
                  <th className="p-4 text-center">Purity</th>
                  <th className="p-4 text-right">Making Charge</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-neutral-50/30 transition-colors">
                    <td className="p-4">
                      <img
                        src={p.imageUrl || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=100&q=80"}
                        alt=""
                        className="w-12 h-12 object-cover rounded-xl border border-neutral-200"
                      />
                    </td>
                    <td className="p-4 font-bold text-[#0B132B]">{p.name}</td>
                    <td className="p-4 font-medium">{p.category} • {p.wearingType}</td>
                    <td className="p-4 text-center font-bold">{p.weight}g</td>
                    <td className="p-4 text-center">
                      <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded font-mono font-bold">
                        {p.purity}{material === "gold" ? "K" : ""}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-neutral-800">
                      {formatCurrency(p.makingCharge)}
                      <span className="text-[9px] text-neutral-400 block font-normal uppercase tracking-wider">
                        {p.makingChargeType === "perGram" ? "per gram" : "flat rate"}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-3">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="text-indigo-600 hover:text-indigo-900 font-bold transition-colors uppercase tracking-wider text-[10px]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="text-red-500 hover:text-red-700 font-bold transition-colors uppercase tracking-wider text-[10px]"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <Modal
          title={editingProduct ? "Modify Collection Details" : "Launch Custom Design"}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <Input
              label="Design Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Imperial Heritage Band"
              required
            />
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Design Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe details regarding gemstone clarity, settings, and inspiration..."
                className="w-full bg-white border border-neutral-300 rounded-md px-3 py-2 text-xs focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] focus:outline-none transition-all duration-200"
                rows="3"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-md px-3 py-2 text-xs focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] focus:outline-none transition-all duration-200"
                >
                  <option value="Rings">Rings</option>
                  <option value="Necklaces">Necklaces</option>
                  <option value="Earrings">Earrings</option>
                  <option value="Bracelets">Bracelets</option>
                  <option value="Pendants">Pendants</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Target Wearer</label>
                <select
                  value={wearingType}
                  onChange={(e) => setWearingType(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-md px-3 py-2 text-xs focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] focus:outline-none transition-all duration-200"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Weight (g)"
                type="number"
                step="0.01"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 8.40"
                required
              />
              <Input
                label="Purity Value"
                type="number"
                value={purity}
                onChange={(e) => setPurity(e.target.value)}
                placeholder={material === "gold" ? "22" : "925"}
                required
              />
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Charge Basis</label>
                <select
                  value={makingChargeType}
                  onChange={(e) => setMakingChargeType(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-md px-3 py-2 text-xs focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] focus:outline-none transition-all duration-200"
                >
                  <option value="perGram">Per Gram</option>
                  <option value="fixed">Fixed Rate</option>
                </select>
              </div>
            </div>

            <Input
              label="Making Charge Amount (₹)"
              type="number"
              value={makingCharge}
              onChange={(e) => setMakingCharge(e.target.value)}
              placeholder="e.g. 1500"
              required
            />

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Image Asset Upload</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full text-xs text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#D4AF37]/10 file:text-[#b08e0b] hover:file:bg-[#D4AF37]/20 transition-all duration-200 cursor-pointer"
              />
              {editingProduct && (
                <p className="text-[10px] text-neutral-400 italic">
                  Leave empty if you don't wish to change the current product picture.
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full font-bold uppercase tracking-wider text-xs py-3.5 rounded-xl shadow-md transition-all duration-200"
              isLoading={isSaving}
            >
              {editingProduct ? "Save Design Details" : "Publish Masterpiece"}
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminProducts;
