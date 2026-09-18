# LJ Jewelry E-Commerce — Project Completion Guide & Status Roadmap

> **Current Project Progress:** ~75% Complete  
> **Status:** Backend fully operational & stabilized. Stitch Luxury Design System & Shell components active. Core storefront landing page complete.

---

## 📊 Phase Status Dashboard

| Phase | Description | Status | Progress |
| :--- | :--- | :---: | :---: |
| **Phase 0** | Bug Fixes & Stabilization | ✅ COMPLETED | 100% |
| **Phase 1** | Security Hardening | ✅ COMPLETED | 100% |
| **Phase 2** | Backend Completion (Orders, Rates, Search, Uploads) | ✅ COMPLETED | 100% |
| **Phase 3** | Frontend Foundation & Stitch Design System | ✅ COMPLETED | 100% |
| **Phase 4** | Frontend Core Pages (Home, Auth, Profile) | 🔄 IN PROGRESS | 60% |
| **Phase 5** | Cart & Checkout Flow (CartDrawer done, Checkout UI pending) | 🔄 IN PROGRESS | 50% |
| **Phase 6** | Admin Dashboard & Management UI | ⏳ PENDING | 0% |
| **Phase 7** | Polish & Advanced Features | ⏳ PENDING | 0% |
| **Phase 8** | Testing | ⏳ PENDING | 0% |
| **Phase 9** | Production Deployment | ⏳ PENDING | 0% |

---

## Table of Contents

1. [Phase 0 — Bug Fixes & Stabilization (✅ COMPLETED)](#phase-0--bug-fixes--stabilization)
2. [Phase 1 — Security Hardening (✅ COMPLETED)](#phase-1--security-hardening)
3. [Phase 2 — Backend Completion (✅ COMPLETED)](#phase-2--backend-completion)
4. [Phase 3 — Frontend Foundation & Design System (✅ COMPLETED)](#phase-3--frontend-foundation--design-system)
5. [Phase 4 — Frontend Core Pages (🔄 IN PROGRESS)](#phase-4--frontend-core-pages)
6. [Phase 5 — Cart & Checkout Flow (🔄 IN PROGRESS)](#phase-5--cart--checkout-flow)
7. [Phase 6 — Admin Dashboard (⏳ REMAINING)](#phase-6--admin-dashboard)
8. [Phase 7 — Polish & Advanced Features (⏳ REMAINING)](#phase-7--polish--advanced-features)
9. [Phase 8 — Testing (⏳ REMAINING)](#phase-8--testing)
10. [Phase 9 — Deployment (⏳ REMAINING)](#phase-9--deployment)

---

## Phase 0 — Bug Fixes & Stabilization (✅ 100% COMPLETED)

> **Goal:** Make the existing code run without crashing.  
> **Status:** `[x] ALL BUGS RESOLVED`

- [x] **Step 0.1 — Fix typo in `order.js`** (`mmongoos` → `mongoose`)
- [x] **Step 0.2 — Fix syntax error in `productRoutes.js`** (`"/".protect` → `"/", protect`)
- [x] **Step 0.3 — Fix `computeCartTotals` → `calcCartTotal`** in `cartController.js`
- [x] **Step 0.4 — Fix `getOrCreateCart` returning null** in `cartController.js`
- [x] **Step 0.5 — Fix `getProductById` arguments to `priceCalculator`**
- [x] **Step 0.6 — Fix `addToCart` index boundary check** (`index < 0`)
- [x] **Step 0.7 — Fix `putProduct` missing response** (added `res.json(updatedProduct)`)
- [x] **Step 0.8 — Fix cart route ordering** (`/clear` before `/:id`)
- [x] **Step 0.9 — Fix fragile import path in `authRoutes.js`**
- [x] **Step 0.10 — Fix stray semicolon in `App.jsx`**
- [x] **Step 0.11 — Fix React component naming conventions** (`Navbar`, `Home`, `Profile`)
- [x] **Step 0.12 — Fix Register & Login pages to use shared API instance**
- [x] **Step 0.13 — Fixed local storage token parsing & added Error Boundary**

### Step 0.1 — Fix the typo in `order.js`

**File:** `backend/src/models/order.js` (Line 12)

The word `mmongoos` needs to be fixed to `mongoose`. This is a `ReferenceError` that will crash the server the moment this model is imported.

```diff
- type: mmongoos.Schema.Types.ObjectId,
+ type: mongoose.Schema.Types.ObjectId,
```

---

### Step 0.2 — Fix syntax error in `productRoutes.js`

**File:** `backend/src/routes/productRoutes.js` (Line 18)

`"/".protect` is accessing a `.protect` property on a string literal. It should be a comma-separated middleware argument.

```diff
- router.post("/".protect, adminOnly, postProduct);
+ router.post("/", protect, adminOnly, postProduct);
```

---

### Step 0.3 — Fix `computeCartTotals` → `calcCartTotal`

**File:** `backend/src/controllers/cartController.js` (Lines 37, 76, 109, 135)

The function `computeCartTotals` is called in 4 places but was never defined or imported. The actual function is `calcCartTotal` from `../utils/cartTotal.js`.

**What to do:**
1. The file already imports `calcCartTotal` on line 5
2. Find-and-replace all 4 occurrences of `computeCartTotals` → `calcCartTotal`

```diff
- const { totalItems, totalPrice } = computeCartTotals(cartItems);
+ const { totalItems, totalPrice } = calcCartTotal(cartItems);
```

> [!IMPORTANT]
> Do this on lines 37, 76, 109, and 135 — all four occurrences.

---

### Step 0.4 — Fix `getOrCreateCart` returning null

**File:** `backend/src/controllers/cartController.js` (Lines 11–17)

When a user has no cart, `findOne` returns `null`. The code then creates a new cart but still returns the original `null` value. This causes a crash on every subsequent operation for new users.

```diff
  const getOrCreateCart = async (userId) => {
-   const cartItems = await cart.findOne({ user: userId });
-   if (!cartItems) {
-     await cart.create({ user: userId, products: [] });
-   }
-   return cartItems;
+   let cartItems = await cart.findOne({ user: userId });
+   if (!cartItems) {
+     cartItems = await cart.create({ user: userId, products: [] });
+   }
+   return cartItems;
  };
```

---

### Step 0.5 — Fix `getProductById` arguments to `priceCalculator`

**File:** `backend/src/controllers/productController.js` (Line 120)

`priceCalculator` expects two arguments `(product, ratePerGram)`, but it's being called with a single object `{ productData, rate }`.

```diff
- const priceDetails = priceCalculator({ productData, rate });
+ const priceDetails = priceCalculator(productData, rate);
```

---

### Step 0.6 — Fix `addToCart` index boundary check

**File:** `backend/src/controllers/cartController.js` (Line 68)

When a product is the first item in the cart array (`index === 0`), the condition `index <= 0` incorrectly treats it as "not found" and sets `currentQty = 0`, resetting its quantity.

```diff
- const currentQty = index <= 0 ? 0 : cartItems.products[index].quantity;
+ const currentQty = index < 0 ? 0 : cartItems.products[index].quantity;
```

---

### Step 0.7 — Fix `putProduct` missing response

**File:** `backend/src/controllers/productController.js` (Lines 133–145)

The `putProduct` function returns a 404 if the product isn't found but sends **no response** on success. The client will hang forever.

```diff
  if (!updatedProduct) {
    return res.status(404).json({ error: "Product not found" });
  }
+ res.json(updatedProduct);
```

---

### Step 0.8 — Fix cart route ordering

**File:** `backend/src/routes/cartRoutes.js` (Lines 14–15)

Express matches routes in order. Since `/:id` comes before `/clear`, a `DELETE /clear` request will match `/:id` with `id = "clear"` and call `removeFromCart` instead of `clearCart`.

```diff
+ router.delete("/clear", protect, clearCart);
  router.delete("/:id", protect, removeFromCart);
- router.delete("/clear", protect, clearCart);
```

---

### Step 0.9 — Fix fragile import path in `authRoutes.js`

**File:** `backend/src/routes/authRoutes.js` (Line 3)

The import path `'../../../backend/src/middlewares/authMiddleware.js'` goes outside the project. Use a relative path.

```diff
- import { protect } from '../../../backend/src/middlewares/authMiddleware.js';
+ import { protect } from '../middlewares/authMiddleware.js';
```

---

### Step 0.10 — Fix stray semicolon in `App.jsx`

**File:** `frontend/src/App.jsx` (Line 36)

There's a stray `;` after `</Routes>` that will render as visible text in the browser.

```diff
      </Routes>
-     ;
    </>
```

---

### Step 0.11 — Fix React component naming conventions

**Files:** `navbar.jsx` (line 5), `home.jsx` (line 3), `profile.jsx` (line 4)

React requires component names to start with an uppercase letter. Rename the function declarations:

```diff
// navbar.jsx
- const navbar = () => {
+ const Navbar = () => {
// ...
- export default navbar;
+ export default Navbar;

// home.jsx
- const home = () => {
+ const Home = () => {
// ...
- export default home;
+ export default Home;

// profile.jsx
- const profile = () => {
+ const Profile = () => {
// ...
- export default profile;
+ export default Profile;
```

---

### Step 0.12 — Fix Register page to use shared API instance

**File:** `frontend/src/pages/register.jsx`

Replace the raw `axios` import with the shared `API` instance:

```diff
- import axios from "axios";
+ import API from "../api/axios.js";

// inside handleRegister:
-     const res = await axios.post(
-       "http://localhost:5000/api/auth/register",
-       formData,
-     );
+     const res = await API.post("/auth/register", formData);
```

---

### Step 0.13 — Verify all fixes

After making all the above changes:

```bash
# Terminal 1 — Start backend
cd backend
npm start

# Terminal 2 — Start frontend
cd frontend
npm run dev
```

**Verify:**
- [ ] Server starts without crashing
- [ ] Can register a new account
- [ ] Can login with email/password
- [ ] Can login with Google
- [ ] Profile page loads without errors
- [ ] No console errors in browser

---

## Phase 1 — Security Hardening (✅ 100% COMPLETED)

> **Goal:** Protect secrets and enforce security measures.  
> **Status:** `[x] ALL SECURITY HARDENING STEPS IMPLEMENTED`

- [x] **Step 1.1 — Secure `.env` files** (added to `.gitignore`, excluded from tracking)
- [x] **Step 1.2 — Move Google Client ID & API URLs to environment variables** (`frontend/.env`)
- [x] **Step 1.3 — Configure CORS headers & origin permissions**
- [x] **Step 1.4 — Add input validation to auth routes** (`express-validator`)
- [x] **Step 1.5 — Add global error handler middleware** (`errorHandler.js`)
- [x] **Step 1.6 — Add rate limiting to auth routes** (`express-rate-limit`)

---

## Phase 2 — Backend Completion (✅ 100% COMPLETED)

> **Goal:** Complete all remaining backend REST endpoints.  
> **Status:** `[x] ALL BACKEND CONTROLLERS & ROUTES IMPLEMENTED`

- [x] **Step 2.1 — Dynamic cart pricing calculation** (`calcCartTotal`)
- [x] **Step 2.2 — Live metal rates controller & model** (`/api/rates`, `rate.js`)
- [x] **Step 2.3 — Build Order controller, model & routes** (`/api/orders`, `orderController.js`)
- [x] **Step 2.4 — Product image upload support** (Multer + Cloudinary/local fallback)
- [x] **Step 2.5 — Product full-text search endpoint** (`/api/products/search`)
- [x] **Step 2.6 — User profile update & change password endpoints** (`/api/auth/profile`)
- [x] **Step 2.7 — Comprehensive API verification & testing**

### Step 2.1 — Fix `cartTotal.js` to work with the dynamic pricing model

**File:** `backend/src/utils/cartTotal.js`

The Product model has no `price` field — prices are dynamically calculated based on metal rates. The cart total must use `priceCalculator`.

```javascript
import { getRate } from './rates.js';
import priceCalculator from './priceCalculator.js';

const calcCartTotal = async (cart) => {
  let totalItems = 0;
  let totalPrice = 0;

  for (const item of cart.products) {
    if (!item.product) continue;
    
    const rate = await getRate(item.product.material);
    const priceDetails = priceCalculator(item.product, rate);
    
    totalItems += item.quantity;
    totalPrice += item.quantity * priceDetails.totalPrice;
  }

  return { totalItems, totalPrice };
};

export default calcCartTotal;
```

> [!IMPORTANT]
> Since `calcCartTotal` is now async, update all call sites in `cartController.js` to `await`:
> ```diff
> - const { totalItems, totalPrice } = calcCartTotal(cartItems);
> + const { totalItems, totalPrice } = await calcCartTotal(cartItems);
> ```

---

### Step 2.2 — Integrate a real Gold/Silver rate API

**File:** `backend/src/utils/rates.js`

Replace the hardcoded rates with a real API. Options:
- **GoldAPI.io** (free tier: 300 requests/month)
- **MetalPriceAPI.com** (free tier available)
- **Manual admin-set rates** (simplest — admin updates via API)

**Option A — External API (GoldAPI.io):**

```javascript
const fetchRate = async (metalType) => {
  const API_KEY = process.env.GOLD_API_KEY;
  const symbol = metalType === 'gold' ? 'XAU' : 'XAG';
  
  const response = await fetch(`https://www.goldapi.io/api/${symbol}/INR`, {
    headers: { 'x-access-token': API_KEY }
  });
  
  if (!response.ok) throw new Error('Rate API failed');
  
  const data = await response.json();
  // API returns price per troy ounce — convert to per gram
  return Math.round(data.price / 31.1035);
};
```

**Option B — Admin-set rates (Recommended for MVP):**

Create a `Rate` model and let admins update rates via an API endpoint:

**File:** Create `backend/src/models/rate.js`:
```javascript
import mongoose from 'mongoose';

const rateSchema = new mongoose.Schema({
  material: { type: String, enum: ['gold', 'silver'], unique: true, required: true },
  pricePerGram: { type: Number, required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Rate', rateSchema);
```

Then update `rates.js` to fetch from the database instead of returning hardcoded values.

---

### Step 2.3 — Build the Order Controller & Routes

This is the core e-commerce feature — allow users to place orders from their cart.

**File:** Create `backend/src/controllers/orderController.js`:

```javascript
import Order from '../models/order.js';
import Cart from '../models/cart.js';
import Product from '../models/product.js';
import { getRate } from '../utils/rates.js';
import priceCalculator from '../utils/priceCalculator.js';
import asyncHandler from 'express-async-handler';

// POST /api/orders — Place a new order from cart
export const placeOrder = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;

  // Validate shipping address
  if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || 
      !shippingAddress.zipCode || !shippingAddress.country) {
    return res.status(400).json({ message: 'Complete shipping address is required' });
  }

  // Get user's cart
  const cart = await Cart.findOne({ user: req.user._id }).populate('products.product');
  if (!cart || cart.products.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  // Calculate prices for each item
  const orderItems = [];
  let totalAmount = 0;

  for (const item of cart.products) {
    if (!item.product) continue;

    const rate = await getRate(item.product.material);
    const priceDetails = priceCalculator(item.product, rate);
    const itemTotal = priceDetails.totalPrice * item.quantity;

    orderItems.push({
      product: item.product._id,
      quantity: item.quantity,
      price: priceDetails.totalPrice,
    });

    totalAmount += itemTotal;
  }

  // Create order
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    totalAmount,
    shippingAddress,
    paymentStatus: 'pending',
    orderStatus: 'processing',
  });

  // Clear the cart after placing order
  cart.products = [];
  await cart.save();

  res.status(201).json(order);
});

// GET /api/orders — Get all orders for the logged-in user
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('items.product', 'name imageUrl material')
    .sort({ createdAt: -1 });

  res.json(orders);
});

// GET /api/orders/:id — Get a single order by ID
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('items.product', 'name imageUrl material purity weight');

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  // Ensure users can only see their own orders (unless admin)
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  res.json(order);
});

// GET /api/orders/admin/all — Admin: Get all orders
export const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const filter = {};
  if (status) filter.orderStatus = status;

  const pageNum = Math.max(1, Number(page));
  const pageSize = Math.max(1, Math.min(50, Number(limit)));

  const total = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .populate('user', 'name email')
    .populate('items.product', 'name imageUrl')
    .sort({ createdAt: -1 })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize);

  res.json({
    orders,
    total,
    totalPages: Math.ceil(total / pageSize),
    currentPage: pageNum,
  });
});

// PUT /api/orders/:id/status — Admin: Update order status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (orderStatus) order.orderStatus = orderStatus;
  if (paymentStatus) order.paymentStatus = paymentStatus;

  await order.save();
  res.json(order);
});

// DELETE /api/orders/:id — Admin: Cancel an order
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  order.orderStatus = 'cancelled';
  await order.save();
  res.json({ message: 'Order cancelled', order });
});
```

**File:** Create `backend/src/routes/orderRoutes.js`:

```javascript
import express from 'express';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/orderController.js';

const router = express.Router();

// User routes
router.post('/', protect, placeOrder);
router.get('/', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);
router.delete('/:id', protect, adminOnly, cancelOrder);

export default router;
```

**File:** Register in `backend/server.js`:

```diff
  import cartRoutes from "./src/routes/cartRoutes.js";
+ import orderRoutes from "./src/routes/orderRoutes.js";

  app.use("/api/cart", cartRoutes);
+ app.use("/api/orders", orderRoutes);
```

---

### Step 2.4 — Add Product Image Upload

**Install:** `npm install multer cloudinary multer-storage-cloudinary` in backend

**Setup Cloudinary account:** Go to https://cloudinary.com, create free account, get credentials.

**File:** Add to `backend/.env`:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**File:** Create `backend/src/config/cloudinary.js`:

```javascript
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'lj-products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
  },
});

export const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
export default cloudinary;
```

**File:** Update `backend/src/routes/productRoutes.js`:

```diff
+ import { upload } from '../config/cloudinary.js';

- router.post("/", protect, adminOnly, postProduct);
+ router.post("/", protect, adminOnly, upload.single('image'), postProduct);
```

**File:** Update `postProduct` in `productController.js`:

```diff
  export const postProduct = async (req, res) => {
+   if (req.file) {
+     req.body.imageUrl = req.file.path; // Cloudinary URL
+   }
    const newProduct = await product.create(req.body);
    res.status(201).json(newProduct);
  };
```

---

### Step 2.5 — Add Product Search

**File:** Update Product model to add text index — `backend/src/models/product.js`:

```diff
+ productSchema.index({ name: 'text', description: 'text' });
```

**File:** Add search endpoint in `backend/src/controllers/productController.js`:

```javascript
export const searchProducts = async (req, res, next) => {
  try {
    const { q, material, page = 1, limit = 10 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const filter = { $text: { $search: q } };
    if (material) filter.material = material;

    const pageNum = Math.max(1, Number(page));
    const pageSize = Math.max(1, Math.min(30, Number(limit)));

    const total = await product.countDocuments(filter);
    const results = await product
      .find(filter, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .lean();

    // Add price details
    if (results.length > 0) {
      const material = results[0].material;
      const rate = await getRate(material);
      results.forEach(p => {
        p.priceDetails = priceCalculator(p, rate);
      });
    }

    res.json({ results, total, totalPages: Math.ceil(total / pageSize), currentPage: pageNum });
  } catch (error) {
    next(error);
  }
};
```

**File:** Add route in `productRoutes.js`:

```diff
+ router.get("/search", searchProducts);
  router.get("/meta", getProductMeta);
```

---

### Step 2.6 — Add User Profile Update

**File:** Add to `backend/src/controllers/authcontroller.js`:

```javascript
import User from '../models/user.js';

const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (avatar) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    
    if (!user.password) {
      return res.status(400).json({ message: 'Google accounts cannot change password' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to change password' });
  }
};

export default { register, Login, googleLogin, getProfile, updateProfile, changePassword };
```

**File:** Add routes in `authRoutes.js`:

```diff
+ router.put('/profile', protect, authcontroller.updateProfile);
+ router.put('/change-password', protect, authcontroller.changePassword);
```

---

### Step 2.7 — Verify the complete backend

At this point your backend API should support:

```
Auth:
  POST   /api/auth/register         — Register
  POST   /api/auth/login             — Login
  POST   /api/auth/google            — Google login
  GET    /api/auth/profile           — Get profile
  PUT    /api/auth/profile           — Update profile
  PUT    /api/auth/change-password   — Change password

Products:
  GET    /api/products/search        — Search products
  GET    /api/products/meta          — Get filter metadata
  GET    /api/products               — List products (with filters)
  GET    /api/products/:id           — Get single product
  POST   /api/products               — Create product (admin)
  PUT    /api/products/:id           — Update product (admin)
  DELETE /api/products/:id           — Delete product (admin)

Cart:
  GET    /api/cart                   — Get cart
  POST   /api/cart                   — Add to cart
  PUT    /api/cart/:id               — Update quantity
  DELETE /api/cart/clear             — Clear cart
  DELETE /api/cart/:id               — Remove item

Orders:
  POST   /api/orders                 — Place order
  GET    /api/orders                 — My orders
  GET    /api/orders/:id             — Order details
  GET    /api/orders/admin/all       — All orders (admin)
  PUT    /api/orders/:id/status      — Update status (admin)
  DELETE /api/orders/:id             — Cancel order (admin)
```

**Test each endpoint using Postman or Thunder Client:**
1. Register a user → Copy the JWT token
2. Set token as `Bearer <token>` in Authorization header
3. Test each route and verify responses

---

## Phase 3 — Frontend Foundation & Stitch Design System

> **Goal:** Establish a high-end luxury design system (Stitch Theme) and core reusable components before building pages.  
> **Estimated Time:** 3–4 hours

### Step 3.1 — Design Tokens & Visual Aesthetics (Stitch Theme)

The LJ Luxury Jewellers frontend adopts a bespoke luxury aesthetic with champagne gold accents, obsidian dark & soft cream surfaces, glassmorphism card containers, and Cormorant Garamond typography.

- **Primary Champagne Gold:** `#D4AF37` / `hsl(46, 65%, 53%)`
- **Rose Gold / Blush:** `#E8C5C8`
- **Royal Navy:** `#0B132B`
- **Dark Obsidian:** `#0D0F12`
- **Card Dark Surface:** `#16191E` (`backdrop-filter: blur(12px)`)
- **Typography:** *Cormorant Garamond* / *Playfair Display* (Serif Titles), *Plus Jakarta Sans* / *Inter* (UI Controls)

---

### Step 3.2 — Configure Tailwind CSS & Fonts in `index.html` & `index.css`

**File:** `frontend/index.html` — Add inside `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

**File:** `frontend/src/index.css` — Configure Tailwind CSS and custom utilities:

```css
@import "tailwindcss";

@layer base {
  :root {
    --color-gold-500: #D4AF37;
    --color-royal-navy: #0B132B;
    --font-heading: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
    --font-sans: 'Plus Jakarta Sans', system-ui, sans-serif;
  }

  body {
    background-color: #FAFAFA;
    color: #1A1D20;
    font-family: var(--font-sans);
  }
}

.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.gold-gradient-text {
  background: linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

### Step 3.3 — Implement Atomic UI Components (`src/components/common`)

Create reusable, theme-consistent common components:

1. **`Button.jsx`** — Primary gold gradient, secondary navy, outline gold, and danger variants.
2. **`Input.jsx`** — Form input with floating label support, gold focus ring, and validation errors.
3. **`Badge.jsx`** — Karat indicator badges (`18K Gold`, `22K Gold`, `925 Silver`, `Hallmarked`).
4. **`Modal.jsx`** — Accessible popup dialog wrapper with backdrop blur.

---

### Step 3.4 — Create Global Context Providers & Utilities

1. **`MetalRateContext.jsx`** (`src/context/MetalRateContext.jsx`)
   - Polls and provides real-time gold (24K, 22K, 18K) and silver market rates per gram.
2. **`CartContext.jsx`** (`src/context/CartContext.jsx`)
   - Manages cart state, optimistic updates, and right-side drawer toggle (`isDrawerOpen`).
3. **`priceCalculator.js`** (`src/utils/priceCalculator.js`)
   - Formula: `(Weight * Live Rate) + Making Charges`.

---

### Step 3.5 — Build Layout Shell Components (`src/components/layout`)

1. **`LivePriceTicker.jsx`** — Top bar showing live gold & silver market prices per gram.
2. **`Navbar.jsx`** — Sticky header with brand logo, mega navigation, live cart count badge, and account menu.
3. **`CartDrawer.jsx`** — Slide-out cart drawer with live price subtotal calculation.
4. **`Footer.jsx`** — Multi-column luxury footer with newsletter subscription.

---

## Phase 4 — Frontend Core Pages (🔄 60% COMPLETED)

> **Goal:** Build the main storefront shopping experience.  
> **Status:** `[x] Home, Auth & Profile Pages Active | [ ] Shop & Product Detail Pages Remaining`

- [x] **Step 4.1 — Home page with hero section & featured products** (`Home.jsx` with luxury jewelry asset banner)
- [ ] **Step 4.2 — Product catalog page** (`Shop.jsx` with material, category & price slider filters)
- [ ] **Step 4.3 — Product detail page** (`ProductDetail.jsx` with gallery & itemized price breakdown)
- [x] **Step 4.4 — Reusable ProductCard component** (`ProductCard.jsx` with live price tag)
- [x] **Step 4.5 — Login & Register page UI** (`Login.jsx`, `register.jsx` with JWT + Google OAuth)
- [x] **Step 4.6 — User profile page** (`profile.jsx` with user info & saved details)

---

### Step 4.2 — Product catalog page (`Shop.jsx`)

**File:** Create `frontend/src/pages/Shop.jsx`

```jsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";
import ProductCard from "../components/product/ProductCard";
import Button from "../components/common/Button";
import { useMetalRates } from "../context/MetalRateContext";

const Shop = () => {
  const { rates } = useMetalRates();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({
    categories: [],
    wearingTypes: [],
    purities: [],
    weightRange: { minWeight: 0, maxWeight: 50 }
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Read filter params from URL
  const material = searchParams.get("material") || "gold";
  const category = searchParams.get("category") || "";
  const wearingType = searchParams.get("wearingType") || "";
  const purity = searchParams.get("purity") || "";
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const minWeight = searchParams.get("minWeight") || "";
  const maxWeight = searchParams.get("maxWeight") || "";

  const [searchInput, setSearchInput] = useState(q);

  // Fetch metadata when material changes
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await API.get(`/products/meta?material=${material}`);
        if (res.data) {
          setMeta(res.data);
        }
      } catch (err) {
        console.error("Error fetching shop metadata:", err);
      }
    };
    fetchMeta();
  }, [material]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let res;
        const params = {
          material,
          page,
          limit: 12,
          sortBy,
          sortOrder,
        };
        if (category) params.category = category;
        if (wearingType) params.wearingType = wearingType;
        if (purity) params.purity = purity;
        if (minWeight) params.minWeight = minWeight;
        if (maxWeight) params.maxWeight = maxWeight;

        if (q) {
          params.q = q;
          res = await API.get("/products/search", { params });
          const list = res.data.results || res.data || [];
          setProducts(list);
        } else {
          res = await API.get("/products", { params });
          const list = res.data.allProducts || res.data || [];
          setProducts(list);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [material, category, wearingType, purity, q, page, sortBy, sortOrder, minWeight, maxWeight]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam("q", searchInput);
  };

  const clearFilters = () => {
    setSearchParams({ material });
    setSearchInput("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Search & Material Selector Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-200">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#0B132B]">
            {material === "gold" ? "Gold Collection" : "Silver Collection"}
          </h1>
          <p className="text-xs text-neutral-500 mt-1 font-sans">
            Showing dynamic live catalog priced using real-time market rates.
          </p>
        </div>

        {/* Material Selection Buttons */}
        <div className="flex items-center gap-3 bg-neutral-100 p-1.5 rounded-lg border border-neutral-200">
          <button
            onClick={() => {
              setSearchParams({ material: "gold" });
              setSearchInput("");
            }}
            className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${
              material === "gold"
                ? "bg-[#D4AF37] text-white shadow-md"
                : "text-[#0B132B] hover:text-[#D4AF37]"
            }`}
          >
            ★ Gold Catalog
          </button>
          <button
            onClick={() => {
              setSearchParams({ material: "silver" });
              setSearchInput("");
            }}
            className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${
              material === "silver"
                ? "bg-[#0B132B] text-[#D4AF37] shadow-md"
                : "text-[#0B132B] hover:text-[#D4AF37]"
            }`}
          >
            ✦ Silver Catalog
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block space-y-6">
          <form onSubmit={handleSearchSubmit} className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B132B]">Search Catalog</h3>
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search rings, necklaces..."
                className="w-full bg-white border border-neutral-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
              />
              <button type="submit" className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-[#D4AF37]">
                🔍
              </button>
            </div>
          </form>

          {meta.categories?.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B132B]">Category</h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => updateParam("category", "")}
                  className={`block text-xs text-left ${!category ? "text-[#D4AF37] font-bold" : "text-neutral-600 hover:text-[#D4AF37]"}`}
                >
                  All Categories
                </button>
                {meta.categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateParam("category", cat)}
                    className={`block text-xs text-left ${category === cat ? "text-[#D4AF37] font-bold" : "text-neutral-600 hover:text-[#D4AF37]"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {meta.wearingTypes?.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B132B]">Wearing Style</h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => updateParam("wearingType", "")}
                  className={`block text-xs text-left ${!wearingType ? "text-[#D4AF37] font-bold" : "text-neutral-600 hover:text-[#D4AF37]"}`}
                >
                  All Styles
                </button>
                {meta.wearingTypes.map((wt) => (
                  <button
                    key={wt}
                    onClick={() => updateParam("wearingType", wt)}
                    className={`block text-xs text-left ${wearingType === wt ? "text-[#D4AF37] font-bold" : "text-neutral-600 hover:text-[#D4AF37]"}`}
                  >
                    {wt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {meta.purities?.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B132B]">Purity</h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => updateParam("purity", "")}
                  className={`block text-xs text-left ${!purity ? "text-[#D4AF37] font-bold" : "text-neutral-600 hover:text-[#D4AF37]"}`}
                >
                  All Purities
                </button>
                {meta.purities.map((p) => (
                  <button
                    key={p}
                    onClick={() => updateParam("purity", p.toString())}
                    className={`block text-xs text-left ${purity === p.toString() ? "text-[#D4AF37] font-bold" : "text-neutral-600 hover:text-[#D4AF37]"}`}
                  >
                    {p}K {material === "gold" ? "Gold" : "Silver"}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button variant="outline" size="sm" className="w-full text-xs" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </aside>

        {/* Catalog Main Panel */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between bg-neutral-50 p-4 rounded-xl border border-neutral-200/80">
            <span className="text-xs text-neutral-500 font-medium">
              {products.length} {products.length === 1 ? "Product" : "Products"} Found
            </span>

            <div className="flex items-center gap-3">
              <label className="text-xs text-neutral-400">Sort By:</label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sb, so] = e.target.value.split("-");
                  updateParam("sortBy", sb);
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set("sortBy", sb);
                  newParams.set("sortOrder", so);
                  setSearchParams(newParams);
                }}
                className="bg-white border border-neutral-200 rounded-md p-1.5 text-xs text-neutral-700 focus:outline-none"
              >
                <option value="createdAt-desc">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="weight-asc">Weight: Light to Heavy</option>
              </select>

              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden bg-[#0B132B] text-white p-2 rounded-md text-xs hover:bg-[#D4AF37]"
              >
                Filters ☰
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-neutral-100 rounded-xl aspect-[3/4] animate-pulse border border-neutral-200" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white border border-neutral-200 rounded-xl">
              <span className="text-4xl">💎</span>
              <h3 className="font-heading text-xl font-bold text-[#0B132B] mt-4">No masterworks match your criteria</h3>
              <p className="text-xs text-neutral-500 mt-2 max-w-sm mx-auto">
                Try clearing selected filters or tweaking search terms to discover our premium inventory.
              </p>
              <Button variant="primary" className="mt-6" onClick={clearFilters}>
                View Full Catalog
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute inset-y-0 right-0 w-80 bg-white shadow-2xl flex flex-col p-6 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="font-heading text-lg font-bold text-[#0B132B]">Filters</h2>
              <button onClick={() => setShowMobileFilters(false)} className="text-neutral-500 hover:text-black">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6">
              {meta.categories?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B132B]">Category</h3>
                  <div className="space-y-1.5">
                    {meta.categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          updateParam("category", category === cat ? "" : cat);
                          setShowMobileFilters(false);
                        }}
                        className={`block text-xs ${category === cat ? "text-[#D4AF37] font-bold" : "text-neutral-600"}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <Button variant="primary" className="w-full" onClick={() => setShowMobileFilters(false)}>
                Show Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
```

---

### Step 4.3 — Product detail page (`ProductDetail.jsx`)

**File:** Create `frontend/src/pages/ProductDetail.jsx`

```jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import { useMetalRates } from "../context/MetalRateContext";
import { useCart } from "../context/CartContext";
import LivePriceBreakdown from "../components/product/LivePriceBreakdown";
import Button from "../components/common/Button";

const ProductDetail = () => {
  const { id } = useParams();
  const { rates } = useMetalRates();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("specs");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error loading product details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <h2 className="font-heading text-2xl font-bold text-[#0B132B]">Masterwork Not Found</h2>
        <p className="text-xs text-neutral-500">The product you are trying to view does not exist or has been removed from our catalog.</p>
        <Link to="/shop">
          <Button variant="primary">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  const isGold = product.material?.toLowerCase() === "gold";
  const karat = product.karat || (isGold ? "22k" : "925");

  let ratePerGram = rates.gold22k;
  if (isGold) {
    if (karat?.toLowerCase() === "24k") ratePerGram = rates.gold24k;
    else if (karat?.toLowerCase() === "18k") ratePerGram = rates.gold18k;
    else ratePerGram = rates.gold22k;
  } else {
    ratePerGram = rates.silver;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-4">
          <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-neutral-200/80 shadow-md">
            <img
              src={product.imageUrl || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] block mb-1">
              {product.category} • {product.wearingType}
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#0B132B]">
              {product.name}
            </h1>
            <p className="text-xs text-neutral-500 font-light mt-2 leading-relaxed">
              {product.description || "Indulge in our exquisite artisan craftsmanship, designed with pristine quality metals and pure stones."}
            </p>
          </div>

          <LivePriceBreakdown
            weight={product.weight}
            ratePerGram={ratePerGram}
            makingCharge={product.makingCharge}
            material={product.material}
            karat={karat}
          />

          <div className="flex items-center gap-6 pt-4 border-t border-neutral-100">
            <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-white shadow-sm">
              <button
                onClick={() => setQty(prev => Math.max(1, prev - 1))}
                className="px-4 py-2 hover:bg-neutral-100 font-semibold text-[#0B132B] transition-colors"
              >
                -
              </button>
              <span className="px-5 py-2 text-xs font-bold text-[#0B132B] bg-neutral-50 border-x border-neutral-200">
                {qty}
              </span>
              <button
                onClick={() => setQty(prev => prev + 1)}
                className="px-4 py-2 hover:bg-neutral-100 font-semibold text-[#0B132B] transition-colors"
              >
                +
              </button>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => addToCart(product._id, qty)}
              className="flex-1"
            >
              Add to Premium Bag
            </Button>
          </div>

          <div className="mt-8 border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <div className="flex border-b border-neutral-200 bg-neutral-50">
              <button
                onClick={() => setActiveTab("specs")}
                className={`flex-1 py-3 text-xs uppercase font-bold tracking-wider transition-colors ${
                  activeTab === "specs"
                    ? "text-[#D4AF37] bg-white border-b-2 border-b-[#D4AF37]"
                    : "text-neutral-500 hover:text-[#0B132B]"
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`flex-1 py-3 text-xs uppercase font-bold tracking-wider transition-colors ${
                  activeTab === "shipping"
                    ? "text-[#D4AF37] bg-white border-b-2 border-b-[#D4AF37]"
                    : "text-neutral-500 hover:text-[#0B132B]"
                }`}
              >
                Insured Shipping
              </button>
            </div>

            <div className="p-6 text-xs text-neutral-600 leading-relaxed">
              {activeTab === "specs" && (
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  <div className="font-semibold text-neutral-500">Metal Material:</div>
                  <div className="text-neutral-800 font-medium capitalize">{product.material}</div>
                  
                  <div className="font-semibold text-neutral-500">Purity Rating:</div>
                  <div className="text-neutral-800 font-medium">{karat.toUpperCase()}</div>

                  <div className="font-semibold text-neutral-500">Total Net Weight:</div>
                  <div className="text-neutral-800 font-medium">{product.weight} Grams</div>

                  <div className="font-semibold text-neutral-500">Certification:</div>
                  <div className="text-neutral-800 font-medium">🛡️ BIS Laser Hallmarked</div>
                </div>
              )}

              {activeTab === "shipping" && (
                <p>
                  Every order from LJ Jewelry is shipped in secure, tamper-evident packaging. Delivery is fully insured by transit specialists. Expect standard shipping within 3-5 business days. Free returns and alterations can be processed under our lifetime exchange policies.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
```

---

### Step 4.5 — Login & Register page UI (`Login.jsx`, `register.jsx`)

**Files:** Rewrite `frontend/src/pages/Login.jsx` and `frontend/src/pages/register.jsx` with the Stitch design system.

#### Login Component (`Login.jsx`)
```jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authContext } from "../context/authContext";
import API from "../api/axios.js";
import { GoogleLogin } from "@react-oauth/google";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

const Login = () => {
  const { login } = useContext(authContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", { email, password });
      login(data);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setError("");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/google", {
        token: credentialResponse.credential,
      });
      login(data);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError("Google authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">
            Welcome Back
          </span>
          <h2 className="font-heading text-3xl font-bold text-[#0B132B]">
            Sign In to LJ Jewelry
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Access your secure profile, orders history, and saved billing settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yourname@example.com"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

          <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
            Sign In
          </Button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-neutral-200"></div>
          <span className="flex-shrink mx-4 text-neutral-400 text-[10px] uppercase font-bold tracking-widest">Or login with</span>
          <div className="flex-grow border-t border-neutral-200"></div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setError("Google login failed")}
            useOneTap
          />
        </div>

        <div className="text-center text-xs text-neutral-500 border-t pt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#D4AF37] hover:underline font-bold">
            Create Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
```

#### Register Component (`register.jsx`)
```jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.post("/auth/register", formData);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">
            Join the Atelier
          </span>
          <h2 className="font-heading text-3xl font-bold text-[#0B132B]">
            Create Luxury Account
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Join to start cataloging favorites, placing orders, and locking live rates.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            onChange={handleChange}
            placeholder="john@example.com"
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

          <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
            Create Profile
          </Button>
        </form>

        <div className="text-center text-xs text-neutral-500 border-t pt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-[#D4AF37] hover:underline font-bold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
```

---

### Step 4.6 — User profile page (`profile.jsx`)

**File:** Rewrite `frontend/src/pages/profile.jsx`

```jsx
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { authContext } from "../context/authContext";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { formatCurrency } from "../utils/formatCurrency";

const Profile = () => {
  const { user, login } = useContext(authContext);
  const [activeTab, setActiveTab] = useState("orders");
  
  const [name, setName] = useState(user?.name || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwMessage, setPwMessage] = useState("");

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
    }
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const res = await API.get("/orders");
        setOrders(res.data || []);
      } catch (err) {
        console.error("Error loading user orders:", err);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage("");
    try {
      const res = await API.put("/auth/profile", { name });
      const updatedUser = { ...user, name: res.data.name || name };
      login(updatedUser);
      setMessage("✓ Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("⚠ Failed to update profile details.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwMessage("");
    if (newPassword !== confirmPassword) {
      setPwMessage("⚠ New passwords do not match.");
      return;
    }
    setIsUpdating(true);
    try {
      await API.put("/auth/change-password", {
        currentPassword,
        newPassword
      });
      setPwMessage("✓ Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setPwMessage(err.response?.data?.message || "⚠ Failed to update password.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const base = "px-2.5 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider ";
    switch (status?.toLowerCase()) {
      case "delivered": return base + "bg-green-100 text-green-700";
      case "processing": return base + "bg-blue-100 text-blue-700";
      case "shipped": return base + "bg-amber-100 text-amber-700";
      case "cancelled": return base + "bg-red-100 text-red-700";
      default: return base + "bg-neutral-100 text-neutral-700";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-[#0B132B] text-white p-8 rounded-2xl border border-[#D4AF37]/30 shadow-xl mb-10 flex flex-col sm:flex-row items-center gap-6 justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#B8960F] text-[#0B132B] flex items-center justify-center font-heading text-3xl font-bold border-2 border-white/20">
            {user?.name ? user.name[0].toUpperCase() : "U"}
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-wide">{user?.name}</h2>
            <p className="text-xs text-neutral-300 font-sans mt-0.5">{user?.email}</p>
            <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-md font-bold uppercase mt-2 inline-block border border-[#D4AF37]/30">
              {user?.role || "Customer"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="space-y-2">
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full text-left px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
              activeTab === "orders"
                ? "bg-[#0B132B] text-white border-l-4 border-l-[#D4AF37]"
                : "bg-white text-neutral-600 hover:bg-neutral-50 hover:text-black border border-neutral-200"
            }`}
          >
            📋 Order History
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full text-left px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
              activeTab === "settings"
                ? "bg-[#0B132B] text-white border-l-4 border-l-[#D4AF37]"
                : "bg-white text-neutral-600 hover:bg-neutral-50 hover:text-black border border-neutral-200"
            }`}
          >
            ⚙ Profile Settings
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`w-full text-left px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
              activeTab === "password"
                ? "bg-[#0B132B] text-white border-l-4 border-l-[#D4AF37]"
                : "bg-white text-neutral-600 hover:bg-neutral-50 hover:text-black border border-neutral-200"
            }`}
          >
            🔒 Security & Password
          </button>
        </aside>

        <div className="lg:col-span-3">
          {activeTab === "orders" && (
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="font-heading text-xl font-bold text-[#0B132B]">Your Placed Orders</h3>
              
              {ordersLoading ? (
                <div className="py-10 text-center animate-pulse text-neutral-400">Loading order timeline...</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16">
                  <span className="text-3xl">📦</span>
                  <h4 className="font-heading text-lg font-bold text-[#0B132B] mt-3">No orders found</h4>
                  <p className="text-xs text-neutral-500 mt-1 mb-6">You haven't placed any jewelry orders yet.</p>
                  <Link to="/shop">
                    <Button variant="primary">Start Shopping</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 divide-y divide-neutral-100">
                  {orders.map((order) => (
                    <div key={order._id} className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-neutral-800">
                            #{order._id.substring(order._id.length - 8).toUpperCase()}
                          </span>
                          <span className={getStatusBadgeClass(order.orderStatus)}>
                            {order.orderStatus}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-1 font-medium">
                          Placed on: {new Date(order.createdAt).toLocaleDateString()} • {order.items?.length || 0} items
                        </p>
                      </div>
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="font-heading text-lg font-bold text-[#0B132B]">
                          {formatCurrency(order.totalAmount)}
                        </span>
                        <Link to={`/orders/${order._id}`}>
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-heading text-xl font-bold text-[#0B132B] mb-6">Profile Settings</h3>
              
              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                <Input
                  label="Full Name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  required
                />
                
                {message && (
                  <p className={`text-xs font-bold ${message.includes("✓") ? "text-green-600" : "text-red-500"}`}>
                    {message}
                  </p>
                )}
                
                <Button type="submit" variant="primary" isLoading={isUpdating} className="w-full">
                  Save Changes
                </Button>
              </form>
            </div>
          )}

          {activeTab === "password" && (
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-heading text-xl font-bold text-[#0B132B] mb-6">Security & Password</h3>
              
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <Input
                  label="Current Password"
                  type="password"
                  name="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <Input
                  label="New Password"
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                
                {pwMessage && (
                  <p className={`text-xs font-bold ${pwMessage.includes("✓") ? "text-green-600" : "text-red-500"}`}>
                    {pwMessage}
                  </p>
                )}
                
                <Button type="submit" variant="primary" isLoading={isUpdating} className="w-full">
                  Change Password
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
```

---

## Phase 5 — Cart & Checkout Flow (🔄 50% COMPLETED)

> **Goal:** Build the complete cart → checkout → order placement flow.  
> **Status:** `[x] Cart Context & CartDrawer Active | [ ] Multi-Step Checkout & Receipt Remaining`

- [x] **Step 5.1 — Cart Context state management** (`CartContext.jsx` with optimistic updates)
- [x] **Step 5.2 — Slide-out Cart Drawer** (`CartDrawer.jsx` with real-time subtotal & item counter)
- [ ] **Step 5.3 — Multi-step checkout page** (`Checkout.jsx` with shipping form & payment gateway UI)
- [ ] **Step 5.4 — Order confirmation receipt page** (`OrderConfirmation.jsx` with tracking timeline)

---

## Phase 6 — Admin Dashboard (⏳ 0% REMAINING)

> **Goal:** Build admin interfaces for catalog management, rates, and order fulfillment.  
> **Status:** `[ ] TO BE IMPLEMENTED`

- [ ] **Step 6.1 — Admin Route Guard** (`AdminRoute.jsx` restricting access to `role === 'admin'`)
- [ ] **Step 6.2 — Admin Dashboard overview** (`AdminDashboard.jsx` with metrics & revenue analytics)
- [ ] **Step 6.3 — Product Management UI** (`AdminProducts.jsx` table with Add/Edit product modal & image upload)
- [ ] **Step 6.4 — Order Fulfillment UI** (`AdminOrders.jsx` with order status updater: Processing, Shipped, Delivered)
- [ ] **Step 6.5 — Live Metal Rates Admin Control** (`LivePriceTicker.jsx` admin manual override toggle)

---

### Implementation Details for Remaining Core Flow:

```jsx
// Wrapped in main.jsx:
<AuthProvider>
  <MetalRateProvider>
    <CartProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CartProvider>
  </MetalRateProvider>
</AuthProvider>
```

---

### Step 5.2 — Cart page

**File:** Create `frontend/src/pages/cart.jsx` (Separate CSS file is not required when using Tailwind CSS)

Full cart management page:

```jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatCurrency";
import Button from "../components/common/Button";
import API from "../api/axios";

const Cart = () => {
  const { cart, removeFromCart, clearCart, refreshCart, isLoading } = useCart();
  const navigate = useNavigate();

  const products = cart?.products || [];
  const totalPrice = cart?.totalPrice || 0;

  const handleQtyChange = async (productId, currentQty, delta) => {
    const nextQty = currentQty + delta;
    if (nextQty < 1) return;
    try {
      await API.put(`/cart/${productId}`, { quantity: nextQty });
      refreshCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-heading text-3xl font-bold text-[#0B132B] mb-8">Shopping Bag</h1>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white border border-neutral-200 rounded-2xl shadow-sm">
          <span className="text-5xl">💎</span>
          <h2 className="font-heading text-2xl font-bold text-[#0B132B] mt-6">Your shopping bag is empty</h2>
          <p className="text-xs text-neutral-500 mt-2 mb-8 max-w-sm mx-auto">
            Discover our fine craftsmanship collections of gold rings, diamond necklaces, and solid sterling silver cuffs.
          </p>
          <Link to="/shop">
            <Button variant="primary">Explore Royal Catalog</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm overflow-hidden">
              <div className="divide-y divide-neutral-100">
                {products.map((item) => {
                  const prod = item.product || {};
                  return (
                    <div key={item._id || prod._id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                      <div className="flex gap-4 items-center">
                        <img
                          src={prod.imageUrl || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=200&q=80"}
                          alt={prod.name}
                          className="w-20 h-20 object-cover rounded-xl border border-neutral-200"
                        />
                        <div>
                          <h3 className="font-heading text-base font-bold text-[#0B132B] hover:text-[#D4AF37] transition-colors">
                            <Link to={`/product/${prod._id}`}>{prod.name}</Link>
                          </h3>
                          <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider mt-1">
                            {prod.material} • {prod.karat?.toUpperCase()} • {prod.weight}g
                          </p>
                          <button
                            onClick={() => removeFromCart(prod._id || item._id)}
                            className="text-red-500 hover:text-red-700 text-xs font-semibold mt-2 block"
                          >
                            Remove Item
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-8 justify-between w-full sm:w-auto">
                        <div className="flex items-center border border-neutral-200 rounded-lg bg-neutral-50 overflow-hidden shadow-xs">
                          <button
                            onClick={() => handleQtyChange(prod._id, item.quantity, -1)}
                            className="px-3 py-1.5 hover:bg-neutral-200 text-sm font-bold text-[#0B132B] transition-colors"
                          >
                            -
                          </button>
                          <span className="px-4 py-1.5 text-xs font-bold text-neutral-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQtyChange(prod._id, item.quantity, 1)}
                            className="px-3 py-1.5 hover:bg-neutral-200 text-sm font-bold text-[#0B132B] transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="font-heading text-lg font-bold text-[#0B132B] block">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                          <span className="text-[10px] text-neutral-400 block font-medium">
                            {formatCurrency(item.price)} each
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Link to="/shop">
                <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-black">
                  ← Continue Shopping
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={clearCart} className="text-xs">
                Clear Shopping Bag
              </Button>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="font-heading text-xl font-bold text-[#0B132B] border-b pb-4">Order Summary</h2>
            
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center text-neutral-600">
                <span>Subtotal ({products.length} Items)</span>
                <span className="font-semibold text-neutral-800">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between items-center text-neutral-600">
                <span>Fully Insured Shipping</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between items-center text-neutral-600">
                <span>Estimated Taxes (included)</span>
                <span className="font-semibold text-neutral-800">3% GST Included</span>
              </div>
              
              <div className="border-t pt-4 flex justify-between items-center text-sm font-bold text-[#0B132B]">
                <span>Total Valuation</span>
                <span className="font-heading text-xl text-[#0B132B]">{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full mt-4"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Secure Checkout
            </Button>
            
            <div className="text-center">
              <span className="text-[10px] text-neutral-400 block">🔒 256-Bit SSL Encrypted Connection</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
```

**File:** Add route in `App.jsx`:
```diff
+ import Cart from "./pages/cart";
 
   <Route path="/cart" element={
     <ProtectedRoute>
       <Cart />
     </ProtectedRoute>
   } />
```

---

### Step 5.3 — Checkout page

**File:** Create `frontend/src/pages/checkout.jsx` (Separate CSS file is not required when using Tailwind CSS)

```jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatCurrency";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import API from "../api/axios";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("India");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const products = cart?.products || [];
  const totalPrice = cart?.totalPrice || 0;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (products.length === 0) {
      setError("Your cart is empty. Add items to checkout.");
      return;
    }

    if (!address || !city || !zipCode || !country) {
      setError("Please complete all shipping address fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await API.post("/orders", {
        shippingAddress: { address, city, zipCode, country }
      });
      if (res.data) {
        await clearCart();
        navigate("/order-confirmation", { state: { orderId: res.data._id } });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to place order. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-heading text-3xl font-bold text-[#0B132B] mb-8">Secure Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="font-heading text-xl font-bold text-[#0B132B]">Shipping Information</h2>
          
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <Input
              label="Street Address"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Luxury Lane, Flat 4B"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Mumbai"
                required
              />
              <Input
                label="ZIP / Postal Code"
                name="zipCode"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="400001"
                required
              />
            </div>
            <Input
              label="Country"
              name="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="India"
              required
            />

            <div className="mt-8 pt-6 border-t border-neutral-200 space-y-4">
              <h3 className="font-heading text-lg font-bold text-[#0B132B]">Payment Option</h3>
              <div className="p-4 border-2 border-[#D4AF37] bg-[#D4AF37]/5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#0B132B] block">Cash on Delivery (COD)</span>
                  <span className="text-[10px] text-neutral-500">Pay in cash or UPI at your doorstep upon secure delivery.</span>
                </div>
                <div className="w-5 h-5 rounded-full border-4 border-[#D4AF37] bg-white flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                </div>
              </div>
            </div>

            {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-6"
              isLoading={isSubmitting}
            >
              Confirm and Place Order
            </Button>
          </form>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="font-heading text-xl font-bold text-[#0B132B] border-b pb-4">Bag Summary</h2>
          
          <div className="space-y-4 divide-y divide-neutral-100 max-h-80 overflow-y-auto pr-2">
            {products.map((item) => {
              const prod = item.product || {};
              return (
                <div key={item._id} className="pt-3 first:pt-0 flex gap-3 items-center">
                  <img
                    src={prod.imageUrl || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=150&q=80"}
                    alt={prod.name}
                    className="w-12 h-12 object-cover rounded-lg border border-neutral-200"
                  />
                  <div className="flex-1 text-xs">
                    <h4 className="font-heading font-bold text-[#0B132B] line-clamp-1">{prod.name}</h4>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                  </div>
                  <span className="text-xs font-bold text-neutral-800">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-4 space-y-2 text-xs">
            <div className="flex justify-between items-center text-neutral-500">
              <span>Subtotal</span>
              <span className="font-semibold text-neutral-800">{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between items-center text-neutral-500">
              <span>Insured Shipping</span>
              <span className="text-emerald-600 font-bold">FREE</span>
            </div>
            <div className="flex justify-between items-center text-neutral-500">
              <span>Taxes (included)</span>
              <span className="font-semibold text-neutral-800">3% GST Included</span>
            </div>
            
            <div className="border-t pt-4 flex justify-between items-center text-sm font-bold text-[#0B132B]">
              <span>Final Amount</span>
              <span className="font-heading text-lg text-[#0B132B]">{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
```

**File:** Add route:
```diff
+ import Checkout from "./pages/checkout";
 
   <Route path="/checkout" element={
     <ProtectedRoute>
       <Checkout />
     </ProtectedRoute>
   } />
```

---

### Step 5.4 — Order confirmation page

**File:** Create `frontend/src/pages/orderConfirmation.jsx`

```jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "../components/common/Button";

const OrderConfirmation = () => {
  const location = useLocation();
  const orderId = location.state?.orderId || "UNKNOWN";

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl mx-auto border-2 border-emerald-300 animate-bounce">
        ✓
      </div>
      
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold block">Order Confirmed</span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#0B132B]">Thank you for your purchase</h1>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
          Your order has been logged and is currently being prepared for shipping under certified insured protocol.
        </p>
      </div>

      <div className="bg-[#FAFAFA] border border-neutral-200 rounded-xl p-4 max-w-md mx-auto">
        <span className="text-[10px] text-neutral-400 block uppercase font-bold tracking-wider">Order ID</span>
        <span className="font-mono text-sm font-bold text-neutral-800">{orderId}</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
        <Link to={`/orders/${orderId}`}>
          <Button variant="primary">Track Order</Button>
        </Link>
        <Link to="/">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
```

---

### Step 5.5 — Order history page

**File:** Create `frontend/src/pages/orders.jsx` (Separate CSS file is not required when using Tailwind CSS)

```jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { formatCurrency } from "../utils/formatCurrency";
import Button from "../components/common/Button";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders");
        setOrders(res.data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadgeClass = (status) => {
    const base = "px-2.5 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider ";
    switch (status?.toLowerCase()) {
      case "delivered": return base + "bg-green-100 text-green-700";
      case "processing": return base + "bg-blue-100 text-blue-700";
      case "shipped": return base + "bg-amber-100 text-amber-700";
      case "cancelled": return base + "bg-red-100 text-red-700";
      default: return base + "bg-neutral-100 text-neutral-700";
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold text-[#0B132B]">Order History</h1>
        <Link to="/profile">
          <Button variant="ghost" size="sm">Back to Account</Button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white border border-neutral-200 rounded-2xl shadow-sm">
          <span className="text-4xl">📦</span>
          <h3 className="font-heading text-xl font-bold text-[#0B132B] mt-4">No Orders Placed</h3>
          <p className="text-xs text-neutral-500 mt-2 mb-6">You have not completed any jewelry purchases yet.</p>
          <Link to="/shop">
            <Button variant="primary">Shop Collection</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-neutral-800">
                    #{order._id.substring(order._id.length - 8).toUpperCase()}
                  </span>
                  <span className={getStatusBadgeClass(order.orderStatus)}>
                    {order.orderStatus}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 font-medium">
                  Placed on: {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  {order.items?.map((item, idx) => (
                    <span key={idx} className="inline-block w-8 h-8 rounded bg-neutral-100 border border-neutral-200 overflow-hidden">
                      <img src={item.product?.imageUrl || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=50&q=80"} alt="" className="w-full h-full object-cover" />
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 border-t pt-4 sm:border-0 sm:pt-0">
                <div>
                  <span className="text-[10px] text-neutral-400 block font-medium">Total Price</span>
                  <span className="font-heading text-lg font-bold text-[#0B132B]">{formatCurrency(order.totalAmount)}</span>
                </div>
                <Link to={`/orders/${order._id}`}>
                  <Button variant="outline" size="sm">View Order</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
```

---

### Step 5.6 — Order detail page

**File:** Create `frontend/src/pages/orderDetail.jsx`

```jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import { formatCurrency } from "../utils/formatCurrency";
import Button from "../components/common/Button";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <h2 className="font-heading text-2xl font-bold text-[#0B132B]">Order Not Found</h2>
        <Link to="/orders">
          <Button variant="primary">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const steps = ["processing", "shipped", "delivered"];
  const currentStepIdx = steps.indexOf(order.orderStatus?.toLowerCase());

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#0B132B]">Order Details</h1>
          <p className="text-[10px] text-neutral-400 mt-1">ID: #{order._id.toUpperCase()} • Placed: {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <Link to="/orders">
          <Button variant="ghost" size="sm">← All Orders</Button>
        </Link>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between max-w-xl mx-auto relative">
          {steps.map((step, idx) => {
            const isActive = idx <= currentStepIdx;
            return (
              <div key={step} className="flex flex-col items-center z-10 flex-1 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  isActive ? "bg-[#D4AF37] border-[#D4AF37] text-white" : "bg-white border-neutral-200 text-neutral-400"
                }`}>
                  {idx + 1}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider mt-2 text-neutral-700 capitalize">{step}</span>
              </div>
            );
          })}
          <div className="absolute top-4 left-10 right-10 h-[2px] bg-neutral-200 -z-0">
            <div
              className="h-full bg-[#D4AF37] transition-all"
              style={{ width: `${(Math.max(0, currentStepIdx) / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="font-heading text-lg font-bold text-[#0B132B]">Items in Order</h2>
          <div className="divide-y divide-neutral-100">
            {order.items?.map((item) => {
              const prod = item.product || {};
              return (
                <div key={item._id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex gap-3 items-center">
                    <img
                      src={prod.imageUrl || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=150&q=80"}
                      alt={prod.name}
                      className="w-12 h-12 object-cover rounded-lg border border-neutral-200"
                    />
                    <div>
                      <h4 className="font-heading text-sm font-bold text-[#0B132B] hover:text-[#D4AF37]"><Link to={`/product/${prod._id}`}>{prod.name}</Link></h4>
                      <p className="text-[10px] text-neutral-400 font-semibold uppercase">{prod.material} • Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-neutral-800">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading text-lg font-bold text-[#0B132B]">Delivery Address</h2>
            <div className="text-xs text-neutral-600 space-y-1">
              <p className="font-semibold text-neutral-800">{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.zipCode}</p>
              <p>{order.shippingAddress?.country}</p>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading text-lg font-bold text-[#0B132B]">Summary</h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Payment Mode:</span>
                <span className="font-semibold text-neutral-800 uppercase">Cash on Delivery</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Payment Status:</span>
                <span className="font-bold text-amber-600 uppercase">{order.paymentStatus}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold text-sm text-[#0B132B]">
                <span>Total Value</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
```

**File:** Add routes:
```diff
+ import Orders from "./pages/orders";
+ import OrderDetail from "./pages/orderDetail";
 
   <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
   <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
```

---

## Phase 6 — Admin Dashboard

> **Goal:** Build a complete admin panel for managing products and orders.  
> **Estimated Time:** 8–12 hours

### Step 6.1 — Admin route protection

**File:** Create `frontend/src/components/AdminRoute.jsx`

```jsx
import { useContext } from 'react';
import { authContext } from '../context/authContext';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { user } = useContext(authContext);
  
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/" />;
  
  return children;
};

export default AdminRoute;
```

> [!IMPORTANT]
> For this to work, the backend login/register responses must include `role` in the response data. Update `localLogin.js`, `localRegister.js`, and `googleLogin.js` to include `role: user.role` in the response JSON.

---

### Step 6.2 — Admin layout with sidebar

**File:** Create `frontend/src/components/AdminLayout.jsx` (Separate CSS file is not required when using Tailwind CSS)

```jsx
import React, { useContext } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { authContext } from "../context/authContext";
import Button from "./common/Button";

const AdminLayout = () => {
  const { user, logout } = useContext(authContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { name: "📈 Dashboard", path: "/admin" },
    { name: "💎 Products", path: "/admin/products" },
    { name: "📦 Orders", path: "/admin/orders" },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-[#0B132B] text-white flex flex-col border-r border-[#D4AF37]/20">
        <div className="p-6 border-b border-[#D4AF37]/20 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#0B132B] flex items-center justify-center font-heading text-lg font-bold">
            LJ
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold tracking-wider leading-none">LJ ADMIN</h2>
            <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-semibold mt-1 block">Management Console</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-[#D4AF37] text-white shadow-md"
                    : "text-neutral-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#D4AF37]/20 flex items-center justify-between gap-2">
          <div className="text-left">
            <span className="text-[10px] text-neutral-400 block">Logged in as</span>
            <span className="text-xs font-bold text-neutral-200 block truncate max-w-[120px]">{user?.name}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="!text-red-400 hover:!bg-red-500/10">
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
```

---

### Step 6.3 — Admin dashboard (stats overview)

**File:** Rewrite `frontend/src/pages/admin.jsx` (Or create `frontend/src/pages/admin/dashboard.jsx`)

```jsx
import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import { formatCurrency } from "../../utils/formatCurrency";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    activeProducts: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const orderRes = await API.get("/orders/admin/all?limit=100");
        const list = orderRes.data?.orders || orderRes.data || [];
        setOrders(list.slice(0, 5));

        const goldMeta = await API.get("/products/meta?material=gold").catch(() => null);
        const silverMeta = await API.get("/products/meta?material=silver").catch(() => null);

        let revenue = 0;
        let pending = 0;
        list.forEach(ord => {
          if (ord.orderStatus !== "cancelled") {
            revenue += ord.totalAmount || 0;
          }
          if (ord.orderStatus === "processing" || ord.orderStatus === "pending") {
            pending++;
          }
        });

        setStats({
          revenue,
          totalOrders: list.length,
          pendingOrders: pending,
          activeProducts: (goldMeta?.data?.categories?.length || 0) + (silverMeta?.data?.categories?.length || 0) + 12
        });
      } catch (err) {
        console.error("Dashboard metric fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-3xl font-bold text-[#0B132B]">Management Overview</h1>
        <p className="text-xs text-neutral-500 mt-1">Live metrics tracking store revenue, orders, and products catalog.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Gross Revenue", val: formatCurrency(stats.revenue), icon: "💼", color: "border-l-[#D4AF37]" },
          { label: "Total Orders logged", val: stats.totalOrders, icon: "📋", color: "border-l-indigo-500" },
          { label: "Pending Fulfillment", val: stats.pendingOrders, icon: "⏳", color: "border-l-amber-500" },
          { label: "Estimated Categories count", val: stats.activeProducts, icon: "💎", color: "border-l-emerald-500" },
        ].map((c, i) => (
          <div key={i} className={`bg-white p-6 rounded-2xl border-l-4 ${c.color} border border-neutral-200/80 shadow-xs flex items-center justify-between`}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">{c.label}</span>
              <span className="font-heading text-2xl font-bold text-[#0B132B] mt-2 block">{c.val}</span>
            </div>
            <span className="text-3xl">{c.icon}</span>
          </div>
        ))}
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs">
        <h2 className="font-heading text-lg font-bold text-[#0B132B] mb-6">Recent Orders</h2>
        
        {orders.length === 0 ? (
          <div className="py-10 text-center text-xs text-neutral-500">No orders placed yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-sans">
                {orders.map((ord) => (
                  <tr key={ord._id} className="text-neutral-700">
                    <td className="py-3 font-mono font-bold text-neutral-800">#{ord._id.substring(ord._id.length - 8).toUpperCase()}</td>
                    <td className="py-3 font-medium">{ord.user?.name || "Guest Account"}</td>
                    <td className="py-3 text-neutral-500">{new Date(ord.createdAt).toLocaleDateString()}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        ord.orderStatus === "delivered" ? "bg-green-100 text-green-700" :
                        ord.orderStatus === "cancelled" ? "bg-red-100 text-red-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-right text-[#0B132B]">{formatCurrency(ord.totalAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
```

---

### Step 6.4 — Admin: Product management page

**File:** Create `frontend/src/pages/admin/products.jsx`

```jsx
import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import { formatCurrency } from "../../utils/formatCurrency";

const AdminProducts = () => {
  const [material, setMaterial] = useState("gold");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Rings");
  const [wearingType, setWearingType] = useState("Unisex");
  const [purity, setPurity] = useState(22);
  const [weight, setWeight] = useState("");
  const [makingCharge, setMakingCharge] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/products?material=${material}&limit=50`);
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
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this jewelry piece?")) return;
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
      alert("Failed to save product details.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[#0B132B]">Products Catalog</h1>
          <p className="text-xs text-neutral-500 mt-1">Manage and create certified gold and silver products.</p>
        </div>
        <Button variant="primary" onClick={handleOpenAddModal}>
          + Create Masterpiece
        </Button>
      </div>

      <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-neutral-200 shadow-xs">
        <button
          onClick={() => setMaterial("gold")}
          className={`px-4 py-2 text-xs font-semibold rounded-lg uppercase tracking-wider transition-all ${
            material === "gold" ? "bg-[#D4AF37] text-white" : "text-neutral-600 hover:text-black"
          }`}
        >
          Gold Products
        </button>
        <button
          onClick={() => setMaterial("silver")}
          className={`px-4 py-2 text-xs font-semibold rounded-lg uppercase tracking-wider transition-all ${
            material === "silver" ? "bg-[#0B132B] text-[#D4AF37]" : "text-neutral-600 hover:text-black"
          }`}
        >
          Silver Products
        </button>
      </div>

      {loading ? (
        <div className="py-10 text-center animate-pulse text-neutral-400">Loading catalog items...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 bg-white border rounded-xl text-neutral-400">No products found.</div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 font-bold uppercase tracking-wider">
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-center">Weight (g)</th>
                <th className="p-4 text-center">Purity</th>
                <th className="p-4 text-right">Making Charge</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-neutral-50">
                  <td className="p-4">
                    <img
                      src={p.imageUrl || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=100&q=80"}
                      alt=""
                      className="w-10 h-10 object-cover rounded-lg border"
                    />
                  </td>
                  <td className="p-4 font-bold text-neutral-800">{p.name}</td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4 text-center font-medium">{p.weight}g</td>
                  <td className="p-4 text-center">
                    <span className="bg-neutral-100 px-2 py-0.5 rounded font-mono font-semibold">
                      {p.purity}{material === "gold" ? "K" : ""}
                    </span>
                  </td>
                  <td className="p-4 text-right font-semibold">{formatCurrency(p.makingCharge)}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(p)}
                      className="text-indigo-600 hover:text-indigo-900 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p._id)}
                      className="text-red-600 hover:text-red-900 font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <Modal
          title={editingProduct ? "Edit Masterwork Details" : "Publish New Masterwork"}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <Input
              label="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Imperial Heritage Ring"
              required
            />
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-500">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details about craftsmanship, gemstone clarity..."
                className="w-full bg-white border border-neutral-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                rows="3"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-500">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                >
                  <option value="Rings">Rings</option>
                  <option value="Necklaces">Necklaces</option>
                  <option value="Earrings">Earrings</option>
                  <option value="Bracelets">Bracelets</option>
                  <option value="Pendants">Pendants</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-500">Style</label>
                <select
                  value={wearingType}
                  onChange={(e) => setWearingType(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
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
                placeholder="4.8"
                required
              />
              <Input
                label="Purity"
                type="number"
                value={purity}
                onChange={(e) => setPurity(e.target.value)}
                placeholder={material === "gold" ? "22" : "925"}
                required
              />
              <Input
                label="Making Charge"
                type="number"
                value={makingCharge}
                onChange={(e) => setMakingCharge(e.target.value)}
                placeholder="2500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-500">Image Asset Upload</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full text-xs text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#D4AF37]/10 file:text-[#92710c] hover:file:bg-[#D4AF37]/20"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full pt-4"
              isLoading={isSaving}
            >
              {editingProduct ? "Save Changes" : "Publish Masterwork"}
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminProducts;
```

---

### Step 6.5 — Admin: Order management page

**File:** Create `frontend/src/pages/admin/orders.jsx`

```jsx
import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import { formatCurrency } from "../../utils/formatCurrency";
import Button from "../../components/common/Button";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = statusFilter
        ? `/orders/admin/all?status=${statusFilter}&limit=50`
        : "/orders/admin/all?limit=50";
      const res = await API.get(url);
      setOrders(res.data?.orders || res.data || []);
    } catch (err) {
      console.error("Error loading admin orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { orderStatus: status });
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    }
  };

  const handleUpdatePayment = async (id, payment) => {
    try {
      await API.put(`/orders/${id}/status`, { paymentStatus: payment });
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to update payment status.");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-[#0B132B]">Order Fulfillment Registry</h1>
        <p className="text-xs text-neutral-500 mt-1">Track payments, process orders, and dispatch packages to customers.</p>
      </div>

      <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-neutral-200 shadow-xs text-xs font-sans">
        <label className="font-semibold text-neutral-500 pl-2">Filter Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-neutral-50 border border-neutral-200 rounded-md p-1.5 font-medium focus:outline-none"
        >
          <option value="">All Orders</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="py-10 text-center animate-pulse text-neutral-400">Loading order list...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 bg-white border rounded-xl text-neutral-400">No orders found.</div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 font-bold uppercase tracking-wider">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Order Status</th>
                <th className="p-4 text-right">Total Amount</th>
                <th className="p-4 text-right">Fulfillment Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {orders.map((ord) => (
                <tr key={ord._id} className="hover:bg-neutral-50">
                  <td className="p-4 font-mono font-bold text-neutral-800">
                    #{ord._id.substring(ord._id.length - 8).toUpperCase()}
                  </td>
                  <td className="p-4 font-semibold text-[#0B132B]">
                    {ord.user?.name || "Guest User"}
                    <span className="text-[10px] text-neutral-400 block font-normal">{ord.user?.email}</span>
                  </td>
                  <td className="p-4 text-neutral-500">{new Date(ord.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <select
                      value={ord.paymentStatus}
                      onChange={(e) => handleUpdatePayment(ord._id, e.target.value)}
                      className={`font-semibold bg-neutral-50 border rounded p-1 text-[11px] uppercase ${
                        ord.paymentStatus === "paid" ? "text-green-700 border-green-200" : "text-amber-700 border-amber-200"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      ord.orderStatus === "delivered" ? "bg-green-100 text-green-700" :
                      ord.orderStatus === "cancelled" ? "bg-red-100 text-red-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right font-bold text-[#0B132B]">{formatCurrency(ord.totalAmount)}</td>
                  <td className="p-4 text-right">
                    <div className="inline-flex gap-2">
                      {ord.orderStatus !== "delivered" && ord.orderStatus !== "cancelled" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(ord._id, "shipped")}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1.5 rounded font-bold uppercase tracking-wider text-[10px]"
                          >
                            Mark Shipped
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(ord._id, "delivered")}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded font-bold uppercase tracking-wider text-[10px]"
                          >
                            Mark Delivered
                          </button>
                        </>
                      )}
                      {ord.orderStatus !== "cancelled" && ord.orderStatus !== "delivered" && (
                        <button
                          onClick={() => handleUpdateStatus(ord._id, "cancelled")}
                          className="bg-red-100 hover:bg-red-200 text-red-600 px-2.5 py-1.5 rounded font-bold uppercase tracking-wider text-[10px]"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
```

---

### Step 6.6 — Wire up admin routes

**File:** Update `frontend/src/App.jsx`:
```diff
+ import AdminRoute from "./components/AdminRoute";
+ import AdminLayout from "./components/AdminLayout";
+ import AdminDashboard from "./pages/admin/dashboard";
+ import AdminProducts from "./pages/admin/products";
+ import AdminOrders from "./pages/admin/orders";

  <Route path="/admin" element={
    <AdminRoute>
      <AdminLayout />
    </AdminRoute>
  }>
    <Route index element={<AdminDashboard />} />
    <Route path="products" element={<AdminProducts />} />
    <Route path="orders" element={<AdminOrders />} />
  </Route>
```

---

## Phase 7 — Polish & Advanced Features

> **Goal:** Take the app from functional to premium.  
> **Estimated Time:** 5–8 hours

### Step 7.1 — Loading states everywhere

Add loading spinners/skeletons to:
- [ ] Product listing page (while fetching)
- [ ] Product detail page
- [ ] Cart page
- [ ] Order pages
- [ ] Profile page

Use `react-spinners` or build custom skeleton loaders:
```jsx
<div className="skeleton skeleton-card" />
<div className="skeleton skeleton-text" />
```

---

### Step 7.2 — Error handling everywhere

Add error boundaries and API error handling:
- [ ] 404 page for unknown routes
- [ ] Error states on every page that fetches data
- [ ] Toast notifications for all user actions
- [ ] Network error handling in axios interceptor:

```javascript
// frontend/src/api/axios.js — add response interceptor
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('UserInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

### Step 7.3 — Create a 404 page

**File:** Create `frontend/src/pages/notFound.jsx`

```jsx
const NotFound = () => (
  <div className="not-found">
    <h1>404</h1>
    <p>Page not found</p>
    <Link to="/" className="btn btn-primary">Go Home</Link>
  </div>
);
```

**File:** Add catch-all route in `App.jsx`:
```diff
+ <Route path="*" element={<NotFound />} />
```

---

### Step 7.4 — Responsive design pass

Go through every page and ensure it works on:
- [ ] Desktop (1280px+)
- [ ] Tablet (768px – 1279px)
- [ ] Mobile (320px – 767px)

Key areas to check:
- Navbar (hamburger menu)
- Product grid (4 cols → 2 cols → 1 col)
- Cart page (sidebar → stacked)
- Forms (full width on mobile)
- Admin table (horizontal scroll on mobile)

---

### Step 7.5 — SEO & metadata

**File:** Install `react-helmet-async`:
```bash
npm install react-helmet-async
```

Add `<title>` and `<meta>` tags to each page:
```jsx
import { Helmet } from 'react-helmet-async';

const Products = () => (
  <>
    <Helmet>
      <title>Gold Jewelry Collection | LJ Jewellers</title>
      <meta name="description" content="Browse our exquisite collection of gold and silver jewelry." />
    </Helmet>
    {/* page content */}
  </>
);
```

---

### Step 7.6 — Performance optimizations

- [ ] **Lazy loading pages** with `React.lazy()` and `Suspense`
- [ ] **Image lazy loading** — `<img loading="lazy" />`
- [ ] **Debounce search** — Don't call API on every keystroke
- [ ] **Memoize expensive components** — `React.memo` on ProductCard

```jsx
// App.jsx — lazy loading example
const Products = React.lazy(() => import('./pages/products'));
const ProductDetail = React.lazy(() => import('./pages/productDetail'));

// In Routes:
<Suspense fallback={<PageLoader />}>
  <Route path="/products" element={<Products />} />
</Suspense>
```

---

## Phase 8 — Testing

> **Goal:** Ensure everything works correctly.  
> **Estimated Time:** 4–6 hours

### Step 8.1 — Backend API testing with Postman

Create a Postman collection with all endpoints. Test:

| Test | Expected |
|------|----------|
| Register with valid data | 200 + JWT |
| Register with existing email | 400 |
| Register with missing fields | 400 + validation errors |
| Login with valid creds | 200 + JWT |
| Login with wrong password | 400 |
| Access protected route without token | 401 |
| Access admin route as regular user | 403 |
| Get products with filters | 200 + filtered results |
| Add to cart | 200 + updated cart |
| Add same product again | Quantity increments |
| Place order with empty cart | 400 |
| Place order with items | 201 + order created |
| Cart is cleared after order | Products array empty |

---

### Step 8.2 — Frontend manual testing checklist

| Flow | Test |
|------|------|
| **Registration** | Fill form → submit → redirects to login |
| **Login** | Fill form → submit → redirects to profile |
| **Google Login** | Click Google button → popup → logged in |
| **Browse Products** | Navigate to /products → see product grid |
| **Filter Products** | Select category/wearing type → grid updates |
| **Product Detail** | Click product → see detail page with pricing |
| **Add to Cart** | Click "Add to Cart" → toast "Added!" → navbar badge updates |
| **Cart Page** | See items → change quantity → totals update |
| **Remove from Cart** | Click remove → item disappears → total updates |
| **Checkout** | Fill shipping address → place order → success page |
| **Order History** | Navigate to /orders → see past orders |
| **Admin Products** | Add product → appears in listing |
| **Admin Orders** | View orders → update status |
| **Logout** | Click logout → redirected to login → protected routes inaccessible |
| **Responsive** | Resize browser → layout adapts |

---

### Step 8.3 — (Optional) Automated tests

**Backend:** Install and configure Jest + Supertest:
```bash
cd backend
npm install --save-dev jest supertest @jest/globals
```

**Frontend:** Vite projects come with Vitest support:
```bash
cd frontend
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

---

## Phase 9 — Deployment

> **Goal:** Deploy the application to production.  
> **Estimated Time:** 2–4 hours

### Step 9.1 — Backend deployment (Render / Railway)

**Option A — Render.com (Free tier):**

1. Push code to GitHub
2. Go to https://render.com → New Web Service
3. Connect GitHub repo → select the `backend` directory
4. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRATION`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `FRONTEND_URL` (your deployed frontend URL)
   - `NODE_ENV=production`
5. Build command: `npm install`
6. Start command: `node server.js` (not nodemon in production)

### Step 9.2 — Frontend deployment (Vercel / Netlify)

**Option A — Vercel (Recommended for Vite/React):**

1. Go to https://vercel.com → Import Project
2. Connect GitHub → select the `frontend` directory
3. Set environment variables:
   - `VITE_API_BASE_URL=https://your-backend-url.onrender.com/api`
   - `VITE_GOOGLE_CLIENT_ID=your_client_id`
4. Build command: `npm run build`
5. Output directory: `dist`

### Step 9.3 — Post-deployment checklist

- [ ] Update CORS origin in backend to your Vercel URL
- [ ] Update Google OAuth authorized origins/redirect URIs in Google Console
- [ ] Test end-to-end flow on production
- [ ] Set up MongoDB Atlas IP whitelist to allow Render/Railway IPs
- [ ] Set up MongoDB Atlas monitoring alerts

---

## 📊 Time Estimates Summary

| Phase | Estimated Time | Priority |
|-------|---------------|----------|
| Phase 0 — Bug Fixes | 1–2 hours | 🔴 Critical |
| Phase 1 — Security | 1–2 hours | 🔴 Critical |
| Phase 2 — Backend Completion | 6–10 hours | 🔴 High |
| Phase 3 — Frontend Foundation | 3–4 hours | 🔴 High |
| Phase 4 — Core Pages | 10–15 hours | 🔴 High |
| Phase 5 — Cart & Checkout | 8–12 hours | 🔴 High |
| Phase 6 — Admin Dashboard | 8–12 hours | 🟡 Medium |
| Phase 7 — Polish | 5–8 hours | 🟡 Medium |
| Phase 8 — Testing | 4–6 hours | 🟡 Medium |
| Phase 9 — Deployment | 2–4 hours | 🟢 Final |
| **Total** | **~48–75 hours** | |

---

> [!TIP]
> **Work in this order.** Each phase builds on the previous one. Don't jump to Phase 4 (frontend pages) before completing Phase 0 (bug fixes) and Phase 2 (backend APIs), or you'll be writing frontend code against a broken backend.
