# LJ Luxury Jewelry — Frontend Structure, Design System & Feature Blueprint

This document outlines the complete architectural, structural, and design specifications for the **LJ Luxury Jewelry E-Commerce Frontend**. It serves as the definitive reference for UI design generation, component architecture, state management, and page implementations.

---

## 🎨 1. Design Aesthetics & Visual Identity

To position LJ as a premium, high-end luxury jewelry brand, the design must feel **elegant, timeless, responsive, and sophisticated**.

### 1.1 Color Palette (Design Tokens)
- **Primary Brand Color (Champagne Gold):** `#D4AF37` / `hsl(46, 65%, 53%)`
- **Secondary Brand Color (Rose Gold / Blush):** `#E8C5C8` / `hsl(353, 42%, 84%)`
- **Luxury Accent (Royal Navy / Dark Sapphire):** `#0F172A` / `#0B132B`
- **Background (Light Mode):** `#FAFAFA` (Soft Cream White)
- **Background (Dark Mode / Luxury Dark):** `#0D0F12` (Deep Obsidian Gray)
- **Surface / Card Background:** `#FFFFFF` (Light) / `#16191E` (Dark) with glassmorphism standard (`backdrop-filter: blur(12px)`)
- **Text Primary:** `#1A1D20` (Light Mode) / `#F3F4F6` (Dark Mode)
- **Text Muted:** `#6B7280` / `#9CA3AF`
- **Metal Accents:**
  - Platinum / Silver: `#E2E8F0`
  - 24K Gold: `#FFD700`
  - 18K Rose Gold: `#B76E79`

### 1.2 Typography
- **Display & Headings:** *Cormorant Garamond* or *Playfair Display* (Serif, elegant, luxurious serif curves for titles, pricing, and product names).
- **Body & Controls:** *Plus Jakarta Sans* or *Inter* (Clean, modern sans-serif for high legibility on small text, inputs, buttons, and metadata).

### 1.3 Motion & Micro-Interactions
- **Smooth Hover Scaling:** `transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)` for product cards and buttons.
- **Glassmorphism:** Light border glow (`border: 1px solid rgba(212, 175, 55, 0.15)`) with subtle drop shadows.
- **Page Transitions:** Fade-and-slide motion for page navigation and modal open/close transitions.

---

## 📁 2. Frontend Folder & Project Architecture

The frontend follows a feature-grouped, clean React 19 + Vite directory layout:

```
frontend/
├── public/
│   ├── favicon.ico
│   └── images/                     # Static assets & brand logos
├── src/
│   ├── api/                        # Centralized API client & endpoint modules
│   │   ├── axios.js                # Axios instance with auth interceptors
│   │   ├── authApi.js              # Auth endpoints (login, register, oauth)
│   │   ├── productApi.js           # Product catalog, filter & CRUD endpoints
│   │   ├── cartApi.js              # Cart mutation & fetch endpoints
│   │   ├── orderApi.js             # Order placement & user order history
│   │   └── metalRatesApi.js        # Real-time gold & silver live pricing API
│   ├── assets/                     # SVGs, icons, global image assets
│   ├── components/                 # Reusable UI Components
│   │   ├── common/                 # Core Design System components
│   │   │   ├── Button.jsx          # Styled primary/secondary/gold outline buttons
│   │   │   ├── Input.jsx           # Custom floating-label text & select inputs
│   │   │   ├── Modal.jsx           # Accessible dialog/popup container
│   │   │   ├── Badge.jsx           # Karat badges (18K, 22K, 24K, 925 Silver)
│   │   │   ├── Skeleton.jsx        # Loading placeholders for cards & grids
│   │   │   └── Toast.jsx           # Animated notification alerts
│   │   ├── layout/                 # Layout shell wrappers
│   │   │   ├── Navbar.jsx          # Sticky header with mega menu, search & cart badge
│   │   │   ├── Footer.jsx          # Multi-column luxury footer & newsletter signup
│   │   │   ├── LivePriceTicker.jsx # Scrolling bar showing real-time gold/silver rates
│   │   │   └── Sidebar.jsx         # Admin & user dashboard sidebar
│   │   ├── product/                # Product-specific components
│   │   │   ├── ProductCard.jsx     # Luxury product card with hover quick-view
│   │   │   ├── ProductGrid.jsx     # Dynamic responsive grid (1 to 4 columns)
│   │   │   ├── ProductFilter.jsx   # Sidebar & mobile drawer multi-select filters
│   │   │   ├── LivePriceBreakdown.jsx # Metal weight + Making charge pricing card
│   │   │   └── ImageGallery.jsx    # Thumbnail gallery with high-res zoom preview
│   │   ├── cart/                   # Cart & Checkout components
│   │   │   ├── CartDrawer.jsx      # Slide-out drawer cart
│   │   │   ├── CartItem.jsx        # Individual item row with quantity controls
│   │   │   └── OrderSummary.jsx    # Price calculation box with coupon code
│   │   └── feedback/
│   │       ├── Loader.jsx          # Custom spinner/shimmer effect
│   │       └── EmptyState.jsx      # Empty cart / search not found states
│   ├── context/                    # React Context State Providers
│   │   ├── AuthContext.jsx         # User auth, token persistence, role checking
│   │   ├── CartContext.jsx         # Cart items count, total, drawer visibility state
│   │   ├── MetalRateContext.jsx    # Global live gold/silver rate updates
│   │   └── ThemeContext.jsx        # Light/Dark mode state
│   ├── hooks/                      # Custom Utility Hooks
│   │   ├── useAuth.js              # Access auth context shortcut
│   │   ├── useCart.js              # Access cart context shortcut
│   │   ├── useMetalRates.js        # Polling hook for live metal rates
│   │   └── useDebounce.js          # Debounce hook for live search input
│   ├── pages/                      # Application Page Routes
│   │   ├── Home.jsx                # Landing page (Hero, Collections, Featured)
│   │   ├── Shop.jsx                # Product listing page with search & filters
│   │   ├── ProductDetail.jsx       # Individual product view & price breakdown
│   │   ├── Cart.jsx                # Detailed cart view
│   │   ├── Checkout.jsx            # Multi-step checkout & payment processing
│   │   ├── OrderConfirmation.jsx   # Post-purchase receipt & delivery tracker
│   │   ├── Login.jsx               # Auth login (Email + Google OAuth)
│   │   ├── Register.jsx            # Auth registration
│   │   ├── Profile.jsx             # User profile, saved addresses & order history
│   │   ├── AdminDashboard.jsx      # Admin overview (Analytics & Quick Actions)
│   │   ├── AdminProducts.jsx       # Admin CRUD table for managing products
│   │   └── AdminOrders.jsx         # Admin order fulfillment & status updater
│   ├── routes/                     # Router configuration
│   │   ├── AppRoutes.jsx           # Main route map
│   │   ├── ProtectedRoute.jsx      # Guard for authenticated users
│   │   └── AdminRoute.jsx          # Guard for admin role (`user.role === 'admin'`)
│   ├── styles/                     # Styling setup
│   │   ├── variables.css           # CSS Custom properties / design tokens
│   │   ├── index.css               # Global reset, typography & utility classes
│   │   └── components.css          # Core custom styles
│   ├── utils/                      # Helper & Formatter functions
│   │   ├── formatCurrency.js       # Currency formatting (e.g. ₹ or $)
│   │   └── priceCalculator.js      # Formula: `(Metal Weight * Live Rate) + Making Charge`
│   ├── App.jsx                     # Root application wrapper
│   └── main.jsx                    # Vite app mount point
```

---

## 🌟 3. Core Features & Page Specifications

### 3.1 Storefront & Public Pages

#### A. Header & Sticky Navbar (`Navbar.jsx` + `LivePriceTicker.jsx`)
- **Live Metal Price Ticker:** A top banner displaying live gold (24K, 22K, 18K) and silver prices per gram with a live indicator pill (e.g. `🟢 Live Rate: Gold 24K ₹7,250/g`).
- **Brand Logo:** Elegant typography logo with emblem.
- **Navigation Links:** Home, Collections (Rings, Necklaces, Earrings, Bracelets, Custom), Live Rates, About Us.
- **Search Bar:** Real-time search with instant autocomplete popover showing product preview thumbnails.
- **Action Icons:** Wishlist (with count badge), User Account / Login button, Cart Drawer trigger (with reactive item count badge).

#### B. Home Page (`Home.jsx`)
- **Hero Banner:** Full-screen immersive slider featuring high-resolution luxury jewelry, dynamic CTA buttons (*"Explore Royal Collection"*), and smooth video/image carousel.
- **Category Grid:** Visual tiles for major jewelry categories (Solitaire Rings, Diamond Necklaces, Gold Chains, Silver Cuffs).
- **Featured / Trending Slider:** Horizontal scrollable card carousel showcasing popular items with live price tags.
- **The Craftsmanship Showcase:** Parallax section highlighting ethical sourcing, certified diamonds, and custom engraving capabilities.
- **Testimonial & Social Proof:** Customer reviews, rating stars, and Instagram feed grid.
- **Newsletter Subscription:** Email signup block offering exclusive preview access for new collections.

#### C. Product Catalog / Shop Page (`Shop.jsx`)
- **Multi-Faceted Sidebar Filters:**
  - Metal Type (Gold 24K, Gold 22K, Gold 18K, Rose Gold, 925 Sterling Silver, Platinum)
  - Category (Rings, Necklaces, Earrings, Bracelets, Pendants)
  - Price Range Slider (Min - Max)
  - Gender / Style (Women, Men, Unisex, Bridal)
  - In Stock Toggle
- **Sorting Options:** Featured, Price: Low to High, Price: High to Low, Newest Arrivals.
- **Grid Layout Switcher:** Toggle between 3-column, 4-column, or list view.
- **Quick View Modal:** Click quick view icon on card to open product details without leaving the catalog page.

#### D. Product Details Page (`ProductDetail.jsx`)
- **High-Res Media Gallery:** Multi-image thumbnails with main zoom-on-hover image viewer.
- **Dynamic Live Metal Price Calculator Component:**
  - Displays real-time cost breakdown transparently:
    $$\text{Final Price} = (\text{Weight in Grams} \times \text{Live Rate per Gram}) + \text{Making Charges} + \text{GST / Taxes}$$
  - Interactive Metal Purity Selector (e.g. switch between 18K, 22K, 24K Gold to watch price update live).
- **Product Metadata:** SKU, Weight (grams), Purity, Diamond Clarity, Dimension specifications.
- **Ring / Bracelet Size Guide Modal:** Interactive size selection helper.
- **Action Buttons:** Add to Cart, Buy Now (Direct Checkout), Add to Wishlist.
- **Accordion Info Tabs:** Description, Shipping & Returns, Certificate of Authenticity details.

#### E. Cart Drawer & Full Cart Page (`CartDrawer.jsx` / `Cart.jsx`)
- **Slide-out Cart Drawer:** Smooth right-side drawer opening on cart button click.
- **Item Cards:** Product thumbnail, title, metal karat, quantity modifier (`+` / `-`), individual item dynamic total, remove item button.
- **Real-Time Summary Breakdown:**
  - Subtotal
  - Estimated Making Charges & Taxes
  - Promotional Coupon Input Field with instant apply/remove tag.
  - Final Total
- **Checkout Button:** Prominent CTA directing to checkout.

#### F. Multi-Step Checkout (`Checkout.jsx`)
- **Step 1: Customer Details & Shipping Address:** Form fields with auto-complete and saved address picker for logged-in users.
- **Step 2: Shipping Method:** Standard Insured Delivery vs Express Courier.
- **Step 3: Payment Gateway Integration:**
  - Credit / Debit Cards
  - UPI / QR Code Payment option
  - Net Banking
  - Cash on Delivery (with policy check)
- **Order Overview Column:** Sticky right panel showing items, price breakdown, and secure payment trust badges.

#### G. User Portal & Dashboard (`Profile.jsx`)
- **Profile Details:** Edit name, phone number, email, change password.
- **Saved Addresses:** Manage multiple shipping/billing addresses.
- **Order History:** Tabbed view of Active Orders vs Past Orders with order tracking status timeline (*Order Placed -> Processing -> Shipped -> Out for Delivery -> Delivered*).

---

### 3.2 Admin Dashboard Pages (Role-Gated)

#### A. Admin Overview (`AdminDashboard.jsx`)
- Metric cards for Total Revenue, Total Orders, Active Catalog Items, and Registered Customers.
- Recent orders table with quick status changer.

#### B. Product Management UI (`AdminProducts.jsx`)
- Data Table of all products with search, pagination, and filter by category.
- **Add / Edit Product Modal:**
  - Product Name, Category, Description
  - Metal Type (Gold, Silver, Platinum) & Karat (18K, 22K, 24K)
  - Weight in Grams & Making Charge per Gram / Flat Rate
  - Stock Quantity & Image URL upload input
  - Live calculated price preview box (shows what customers will see with current live metal rates).

#### C. Metal Rates Management (`LivePriceTicker.jsx` admin controls)
- Manual rate override or API source connector toggle to update gold/silver base rates per gram.

---

## 🛠️ 4. Technical Architecture & State Flow

```
                         +-----------------------+
                         |     React App.jsx     |
                         +-----------+-----------+
                                     |
               +---------------------+---------------------+
               |                     |                     |
     +---------v---------+ +---------v---------+ +---------v---------+
     |   AuthContext     | |    CartContext    | | MetalRatesContext |
     | (User, JWT, Role) | | (Items, Totals)   | | (Live Gold/Silver)|
     +---------+---------+ +---------+---------+ +---------+---------+
               |                     |                     |
               +---------------------+---------------------+
                                     |
                         +-----------v-----------+
                         |     Axios API Layer   |
                         |  (src/api/axios.js)   |
                         +-----------+-----------+
                                     |
                         +-----------v-----------+
                         |  Express REST Backend |
                         +-----------------------+
```

### 4.1 Axios Interceptor Pattern
- **Request Interceptor:** Reads JWT token from `localStorage` or `AuthContext` and automatically attaches `Authorization: Bearer <token>` to requests.
- **Response Interceptor:** Global error handling (captures `401 Unauthorized` to trigger session expiry logout and toast notifications).

### 4.2 Dynamic Pricing Utility Pattern (`src/utils/priceCalculator.js`)
```javascript
export const calculateProductPrice = (weightInGrams, liveRatePerGram, makingCharges) => {
  if (!weightInGrams || !liveRatePerGram) return 0;
  const baseMetalCost = weightInGrams * liveRatePerGram;
  const total = baseMetalCost + (makingCharges || 0);
  return Math.round(total);
};
```

---

## 🖼️ 5. UI Design Generations & Asset Prompting Guide

When generating visual mockups or component designs via image generators or UI generator tools, use the following standardized prompt templates:

### Prompt 1: Luxury Product Card UI
> *"Modern luxury jewelry product card UI design, dark obsidian theme with champagne gold accent highlights (`#D4AF37`). Displays a high-resolution diamond ring on a velvet pedestal. Includes title 'Solitaire Empress Ring', karat badge '18K White Gold', dynamic live price tag, wishlist heart button, and a frosted glass 'Add to Cart' button with smooth hover glow. Clean modern typography, sleek, 4k detail, UI design artifact."*

### Prompt 2: Hero Section UI
> *"E-commerce hero section design for high-end gold and diamond jewelry brand. Dark background `#0B132B` with soft warm gold lighting ambient glow. Includes a bold elegant serif headline 'Crafted for Eternity', subtitle, dual primary CTAs ('Explore Collection' and 'Live Gold Rates'), and a responsive background slider featuring gold necklaces."*

### Prompt 3: Product Detail Page & Price Breakdown
> *"Clean mobile and desktop responsive product detail page for a luxury gold bracelet. Features an image gallery on the left and a live pricing breakdown card on the right. Card displays metal weight (14.5g), karat selector pills (18K, 22K, 24K), live metal market rate update ticker, itemized making charges, and a gold checkout CTA button."*

---

## 🚦 6. Next Implementation Checklist for Frontend

- [ ] **Step 1: CSS Design Tokens & Reset Setup** — Populate `src/styles/variables.css` and `index.css` with colors, typography, glassmorphism utilities, and responsive breakpoints.
- [ ] **Step 2: Component Library Scaffolding** — Create common atomic components (`Button`, `Input`, `Modal`, `Badge`, `Card`).
- [ ] **Step 3: Global Context Providers** — Implement `AuthContext.jsx`, `CartContext.jsx`, and `MetalRateContext.jsx`.
- [ ] **Step 4: Layout Shell & Navigation** — Build `Navbar.jsx`, `LivePriceTicker.jsx`, and `Footer.jsx`.
- [ ] **Step 5: Storefront Pages** — Build `Home.jsx`, `Shop.jsx` with filters, and `ProductDetail.jsx` with price calculation.
- [ ] **Step 6: Cart & Checkout Flow** — Implement slide-out `CartDrawer.jsx` and `Checkout.jsx`.
- [ ] **Step 7: Admin Portal UI** — Build `AdminProducts.jsx` table with add/edit product modal.
- [ ] **Step 8: Routing & Guards** — Configure `AppRoutes.jsx` with protected and admin route wrappers.
