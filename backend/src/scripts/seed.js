import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Product from '../models/product.js';

const products = [
  {
    name: "Classic Solitaire Diamond Ring",
    description: "An iconic round brilliant-cut solitaire diamond replica set in an elegant 18K gold band. Perfect for engagements or milestone celebrations.",
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    material: "gold",
    category: "Rings",
    wearingType: "Women",
    purity: 18,
    weight: 4.5,
    makingCharge: 800,
    makingChargeType: "perGram"
  },
  {
    name: "Royal Champagne Gold Bangle",
    description: "Crafted in 22K yellow gold, this classic luxury bangle features intricate hand-engraved traditional filigree design patterns.",
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80",
    material: "gold",
    category: "Bracelets",
    wearingType: "Women",
    purity: 22,
    weight: 18.5,
    makingCharge: 450,
    makingChargeType: "perGram"
  },
  {
    name: "Monarch Gold Band",
    description: "A robust yet comfortable classic domed wedding band in solid 22K gold. Smooth polished finish for a lifetime of elegance.",
    imageUrl: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
    material: "gold",
    category: "Rings",
    wearingType: "Unisex",
    purity: 22,
    weight: 7.8,
    makingCharge: 500,
    makingChargeType: "perGram"
  },
  {
    name: "Empress Emerald Drop Earrings",
    description: "Exquisite drop earrings featuring vibrant pear-cut natural emerald replicas encircled by fine micro-pave diamonds in solid 18K yellow gold.",
    imageUrl: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=800&q=80",
    material: "gold",
    category: "Earrings",
    wearingType: "Women",
    purity: 18,
    weight: 8.2,
    makingCharge: 950,
    makingChargeType: "perGram"
  },
  {
    name: "Aura Herringbone Silver Chain",
    description: "Premium Italian 925 sterling silver herringbone chain. Lays perfectly flat, catching light beautifully with every movement.",
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    material: "silver",
    category: "Necklaces",
    wearingType: "Unisex",
    purity: 925,
    weight: 24.5,
    makingCharge: 120,
    makingChargeType: "perGram"
  },
  {
    name: "Obsidian Solitaire Silver Ring",
    description: "Stunning sterling silver ring featuring a central polished black obsidian stone, flanked by textured architectural bands.",
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    material: "silver",
    category: "Rings",
    wearingType: "Men",
    purity: 925,
    weight: 9.5,
    makingCharge: 180,
    makingChargeType: "perGram"
  },
  {
    name: "Elysian Silver Cuff Bracelet",
    description: "A contemporary minimalist open cuff bracelet handcrafted in pure 925 sterling silver with a beautiful brushed satin finish.",
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80",
    material: "silver",
    category: "Bracelets",
    wearingType: "Women",
    purity: 925,
    weight: 14.2,
    makingCharge: 150,
    makingChargeType: "perGram"
  },
  {
    name: "Tears of Venus Pearl Earrings",
    description: "Lustrous round freshwater pearls suspended from delicate 925 sterling silver leverbacks set with micro-cubic zirconia.",
    imageUrl: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=800&q=80",
    material: "silver",
    category: "Earrings",
    wearingType: "Women",
    purity: 925,
    weight: 5.6,
    makingCharge: 220,
    makingChargeType: "perGram"
  },
  {
    name: "Imperial Gold Choker",
    description: "A breathtaking bridal statement choker in heavy 22K gold, decorated with traditional temple motifs and small ruby drops.",
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    material: "gold",
    category: "Necklaces",
    wearingType: "Women",
    purity: 22,
    weight: 32.0,
    makingCharge: 600,
    makingChargeType: "perGram"
  },
  {
    name: "Ares Titanium-Silver Band",
    description: "A rugged men's wedding band combining high-durability modern design elements with pure 925 sterling silver borders.",
    imageUrl: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
    material: "silver",
    category: "Rings",
    wearingType: "Men",
    purity: 925,
    weight: 6.8,
    makingCharge: 200,
    makingChargeType: "perGram"
  }
];

const seedDB = async () => {
  await connectDB();
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products from database.");

    // Insert new products
    const inserted = await Product.insertMany(products);
    console.log(`Successfully seeded database with ${inserted.length} luxury jewelry products!`);
  } catch (error) {
    console.error("Seeding database failed:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
