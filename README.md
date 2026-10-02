# Karachi Bakery Website — 10-Day Sprint Redesign

A comprehensive, modern redesign of the iconic **Karachi Bakery** web platform (Est. 1953, Hyderabad), resolving the **Top 15 UX and E-Commerce Architecture Problems**.

![Karachi Bakery Brand](https://img.shields.io/badge/Karachi%20Bakery-Est.%201953-8B0000?style=for-the-badge)
![Status](https://img.shields.io/badge/Sprint%20Progress-Day%2010%20of%2010%20--%20100%25%20Completed-brightgreen?style=for-the-badge)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-karachi--bakery--website--redesign.vercel.app-000000?style=for-the-badge&logo=vercel)](https://karachi-bakery-website-redesign.vercel.app)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

> 🔗 **Live Website Demo:** [https://karachi-bakery-website-redesign.vercel.app](https://karachi-bakery-website-redesign.vercel.app)

---

## 📅 10-Day Execution Roadmap

| Day | Primary Focus | Status |
| :---: | :--- | :---: |
| **Day 1** | **Brand Architecture, Design System & Customer Journey Hub** | ✅ **Completed** |
| **Day 2** | **Category Architecture & Visual Mega Menu** | ✅ **Completed** |
| **Day 3** | **Multi-Faceted Search & Advanced Filtering** | ✅ **Completed** |
| **Day 4** | **Standardized Product Detail (PDP) & Smart Recommendations** | ✅ **Completed** |
| **Day 5** | **Side-by-Side Product Comparison Drawer & Matrix** | ✅ **Completed** |
| **Day 6** | **Dedicated B2B & Corporate Bulk Order Suite** | ✅ **Completed** |
| **Day 7** | **Interactive Custom Cake & Celebration Builder** | ✅ **Completed** |
| **Day 8** | **Interactive Map-Based Store Locator** | ✅ **Completed** |
| **Day 9** | **Pincode Delivery Estimator & Unified Checkout Cart** | ✅ **Completed** |
| **Day 10** | **Final Quality Assurance, Responsiveness & Final Report** | ✅ **Completed** |

---

## 🚀 Day 10 Achievements (Sprint Completion 🏁)

- **Comprehensive Quality Assurance & Responsive Audit**: Full cross-browser and cross-device testing across smartphones, tablets, and desktop displays.
- **Accessibility & Keyboard Navigation (a11y)**: Complete ARIA landmark roles, semantic tags, and universal `Escape` key dismiss handlers for all modals and drawers.
- **Final Sprint Capstone Report**: Published comprehensive 15-problem resolution matrix and architecture documentation in [`docs/DAY-10-FINAL-REPORT.md`](docs/DAY-10-FINAL-REPORT.md).

---

## 🔐 Store Operations & Admin Management Portal (Back-Office Hub)

To provide a complete enterprise e-commerce architecture beyond the customer storefront, the redesign includes an interactive **Store Manager & Operations Admin Portal**:

- **Customer Experience:** Completely hidden from normal shoppers to preserve a clean, authentic brand presentation.
- **How to Access (Authorized Staff & Evaluators):**
  1. **Direct URL Hash:** Add `/#admin` to the website URL (e.g. [`https://karachi-bakery-website-redesign.vercel.app/#admin`](https://karachi-bakery-website-redesign.vercel.app/#admin)).
  2. **Secret Keyboard Shortcut:** Press `Ctrl + Shift + A` anywhere on the page.
  3. **Secret Logo Double-Click:** Double-click the golden **`KB`** brand emblem in the header.
  4. **Discreet Footer Link:** Click the subtle `Staff Access` link in the bottom copyright line.
- **Demo Access Passcode:** `admin123` (or click *"⚡ 1-Click Instant Manager Login"*).
- **Core Admin Modules:**
  1. **Dynamic Cost & Price Management**: Adjust item selling prices/costs on the fly with immediate DOM recalculation across product cards, PDP, compare, and shopping cart.
  2. **Inventory Stock Status Controls**: Toggle any product between `🟢 In Stock` and `🔴 Out of Stock`. When out of stock, the public storefront marks the card with a `SOLD OUT` ribbon and disables "Add to Cart".
  3. **Delicacy Publisher**: Add brand new bakery items directly into the live storefront catalog with category, price, pack size, dietary flags, and emoji icons.
  4. **Live Orders & Kitchen Dispatch Dispatcher**: Real-time incoming order ledger synced directly with customer checkout. Admin can advance order status (`Baking in Kitchen` → `Air Cargo Handover` → `Out for Delivery` → `Delivered`), dynamically updating the customer's live tracking screen!
  5. **Promo Coupon Engine**: Create and manage custom discount codes (`KBHERITAGE`, `FESTIVE20`, etc.) that are instantly accepted at customer checkout.
  6. **Corporate B2B Orders & Quotes Pipeline**: Track enterprise requisitions (Infosys, Google, Deloitte), update sales stages, verify GSTINs, and print formal GST pro-forma invoices.
  7. **Artisanal Custom Cake Studio Registry**: Manage bespoke tiered cake bookings, track chef assignments (Chef Farhan, Chef Anjali), inspect plaque messages, and monitor refrigerated cold-chain dispatch.
  8. **Live Announcement & 1-Click Festive Ambience Controller**: Live-edit the top announcement strip text/badge without code and transform the storefront with 1-click festive theme presets (Diwali Saffron 🪔, Eid Emerald 🌙, Christmas Plum 🎄).
  9. **Month-Wise Revenue & Orders Financial Hub**: Interactive month reporting period selector (Sep 2026 Current, Aug 2026, Jul 2026, Jun 2026, May 2026, Apr 2026, FY 2026 YTD), visual MoM bar chart, and comprehensive financial breakdown ledger with Corporate B2B vs Retail Online B2C revenue split and Average Order Value (AOV).
  11. **Multi-Branch Store Assignment & Inventory Scope**: Assign product fulfillment scope (*All 54 Branches Nationwide*, *Hyderabad Flagships Only*, *Dine-In Cafes & Bistros Only*, *Airport 24/7 Outlets Only*). Customers see real-time branch availability pills on product cards and can check instant in-store pickup across landmark outlets directly in the Product Detail (PDP) modal.
  12. **Top Header Location & Delivery Branch Switcher (Blinkit/Swiggy-Style)**: Header location pill and modal with 1-click GPS auto-detect, 6-digit pincode lookup, and branch-specific delivery SLA (2-Hour Hyderabad express vs 3-Hour metro vs Pan-India Air Cargo). Dynamically updates catalog product badges and pre-fills checkout fulfillment.
  13. **💳 Razorpay Payment Gateway Hub & Key Vault**: Configure live or test Razorpay API credentials (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`), inspect verified `pay_...` transaction signatures, and test-launch the Razorpay checkout modal directly from the back-office without redeploying code.

---

## 🌟 Advanced E-Commerce Innovations & Cultural Heritage Suite

To elevate the platform beyond conventional storefronts, 5 advanced experiential systems were engineered:

1. **🎁 Interactive "Build-Your-Own Gift Box" (BYOB) Studio with Multi-Size Capacities**:
   - **Multi-Capacity Box Sizing**: Support for 4 distinct weight capacities:
     - **250 gm Petite Keepsake Box** (2 Delicacy Slots • Included ₹0 • 5% OFF)
     - **500 gm (Half kg) Royal Heritage Tin** (4 Delicacy Slots • +₹50 Box • 10% OFF • Most Popular)
     - **1 kg Imperial Grand Chest** (6 Delicacy Slots • +₹120 Box • 15% OFF)
     - **1.5 kg Nizam's Velvet Trunk** (8 Delicacy Slots • +₹190 Box • 20% OFF)
   - **Dynamic Adaptive Tray**: Visual tray automatically re-renders between 2, 4, 6, and 8 delicacy slots on box selection with smart capacity trimming and live counter.
   - **Real-time Tiered Combo Savings**: Automatic discount calculation (5% to 20% OFF) with gold-foiled personalized greeting card message.
2. **☕ Hyderabadi Irani Chai & Delicacy "Pairing Concierge"**:
   - Authentic tea-room recommendation engine: pairing hot brews (*Irani Chai, South Indian Filter Coffee, Kashmiri Kahwa, Badam Malai Milk, Earl Grey*) with iconic biscuits.
   - Master Baker Dip Guidelines (*"The 3-Second Dip: Submerge halfway into steaming Irani chai for exactly 3 seconds for creamy dairy butter melt"*).
   - 1-click curated tea-time pairing bundle checkout.
3. **🌐 Hyderabad Heritage Multilingual Switcher (English • తెలుగు • हिन्दी)**:
   - Dynamic trilingual internationalization (i18n) reflecting Hyderabad's authentic multilingual culture.
   - Translates customer journey tabs, top announcement strip, search placeholders, and buttons.
4. **✍️ Interactive Customer Review & 5-Star Rating Modal**:
   - Verified buyers can submit star ratings (1 to 5 stars), review headlines, and detailed culinary feedback directly within the Product Detail Page (PDP).
   - User reviews are saved in `localStorage` and dynamically incorporated into ratings.
5. **📱 Installable Mobile PWA (Progressive Web App) & Rich Social OpenGraph**:
   - `manifest.json` and `service-worker.js` offline caching enable 1-tap installation on Android & iOS home screens.
   - Rich OpenGraph and Twitter Card meta tags for preview cards on WhatsApp, LinkedIn, and Twitter.
6. **💳 Official Razorpay Payment Gateway & Checkout SDK Integration**:
   - Authentic Razorpay Checkout SDK (`checkout.js`) modal offering instant UPI (GPay, PhonePe, Paytm, QR code scanning), Credit/Debit cards, Net Banking, and Wallets.
   - Robust serverless backend (`/api/razorpay`) with automated order generation in paise, HMAC-SHA256 signature verification, and MongoDB Atlas database order syncing.
   - Dual-mode resilience with seamless fallback simulator to guarantee zero-downtime demo presentations.
   - Dynamic pay button indicators and verified Razorpay transaction badge with payment ID tracking.

---

## 🚀 Day 9 Achievements

- **Pincode Delivery Estimator & Multi-Zone Shipping (Problem #12 Solved)**:
  - Real-time 6-digit Indian postal code validator across **19,000+ Pincodes**.
  - Dynamic transit zone engine: **Hyderabad Local Express (Same-Day Fresh Delivery)**, **South India Metros (48h Express Air)**, and **Pan-India BlueDart Express (3-5 Days)**.
  - Live arrival date computation with freshness guarantee standards.
- **Unified Multi-Step In-App Checkout Suite (Problem #4 Solved)**:
  - Seamless 3-step in-app checkout without external redirects: Address & Contact (with 1-click demo autofill), Shipping Transit Speed, and Multi-Payment Gateway.
  - Optional celebratory gift wrapping and custom greeting card inscription.
  - **Multi-Payment Gateway Simulator**: Instant UPI (GPay, PhonePe, Paytm QR code scan), Credit/Debit Cards, Net Banking, and Cash on Delivery (COD).
  - Built-in discount coupon engine (`KBHERITAGE` saves ₹100, `FESTIVE20` saves ₹150).
- **Animated Order Confirmation & Live Tracking Hub**:
  - Celebration confirmation screen with unique order tracking ID (`KB-ORD-2026-XXXX`).
  - Interactive 4-stage delivery timeline (*Order Placed*, *Baking in Central Kitchen*, *Air Cargo Transit*, *Out for Delivery*).
  - WhatsApp delivery update alerts opt-in and printable tax invoice generator.

For full technical details, see the [Day 9 Progress Report](docs/DAY-09-REPORT.md).

---

## 🚀 Day 8 Achievements

- **Interactive National Store Locator Hub (Problems #5 & #6 Solved)**:
  - **54-Outlet Nationwide Multi-Metro Directory**: Full verified directory of **54 iconic Karachi Bakery outlets** spanning 9 key regions:
    - **Hyderabad & Secunderabad (22)**: Moazzam Jahi Market Flagship, Banjara Hills, Jubilee Hills, Hitec City, Gachibowli, RGIA T1 & T2, Charminar, Begumpet, Kondapur, Madhapur, Kukatpally, Dilsukhnagar, AS Rao Nagar, Somajiguda, Attapur, Tolichowki, Manikonda, Karkhana, Miyapur, Chandanagar, Nagole.
    - **Bengaluru (8)**: Indiranagar 100ft Rd, Kempegowda Airport T1 & T2, Koramangala 5th Block, Whitefield Forum, Jayanagar 4th Block, HSR Layout Sector 1, MG Road.
    - **Mumbai (6)**: Bandra Linking Rd, CSMI Airport T1 & T2, High Street Phoenix Lower Parel, Colaba Causeway, Juhu Tara Rd.
    - **Delhi NCR (6)**: Connaught Place L-Block, IGI Airport T1 & T3, Cyber Hub Gurgaon, Noida Sector 18, South Extension II.
    - **Chennai (3)**: T. Nagar Usman Rd, Chennai International Airport T1, Phoenix Marketcity Velachery.
    - **Pune (3)**: Koregaon Park North Main Rd, Phoenix Marketcity Viman Nagar, Pune Airport Lohegaon.
    - **Kolkata (2)**: Netaji Subhash Chandra Bose Airport Departures, Park Street Heritage Corner.
    - **Goa (2)**: Goa Dabolim Airport T1, Manohar International Airport Mopa.
    - **Andhra Pradesh (2)**: Vijayawada Benz Circle Heritage Hub, Visakhapatnam VIP Road Heritage Parlour.
  - **Dynamic City & Outlet Type Filter Pills**: 1-click filtering by 9 metro regions and 5 outlet concepts (*Heritage Flagships*, *Airport 24/7 Kiosks*, *Artisanal Cafes & Dine-In*, *Express Retail*).
  - **Real-Time Live Status Engine**: Automatically computes whether an outlet is currently open based on user device time (`🟢 Open Now • Closes [Time]`, `✈️ Open 24 Hours`, or `🔴 Closed • Opens [Time]`).
  - **Direct Actions**: 1-click `🗺️ Get Directions` (deep links to Google Maps coordinates), `📞 Call Outlet` (`tel:`), and `💬 Share via WhatsApp`.
  - **Interactive Visual India Map Canvas**: Pulsing radar pins across all 9 regions with real-time selection synchronization.
  - **Active Location Spotlight Card**: Dynamic showcase panel updating instantly as stores or pins are selected.

For full technical details, see the [Day 8 Progress Report](docs/DAY-08-REPORT.md).

---

## 🚀 Day 7 Achievements

- **Interactive Custom Cake & Celebration Studio (Problems #10 & #11 Solved)**:
  - **4-Step Guided Customizer Wizard**: Replaced static, generic order forms with a guided 4-step builder:
    1. *Flavor & Dietary Profile*: 6 gourmet artisan sponges (Belgian Dark Truffle, Butterscotch Crunch, Red Velvet & Cream Cheese, Fresh Fruit Custard, Nutella Hazelnut, Gulab Jamun Fusion) with 100% Eggless, Classic European, Sugar-Free Stevia, and Gluten-Free tags.
    2. *Size, Tiers & Geometry*: 0.5 kg to 3.5 kg with single, dual-stack, or 3-tier grand celebration architectures and shape selectors (Round, Romantic Heart, Modern Square).
    3. *Frosting & Gourmet Accents*: Whipped cream, Italian buttercream, Belgian ganache drips, mirror glazes, macarons, 24K gold leaf, fresh berries, and handcrafted fondant roses.
    4. *Message Inscription & Bakery Timeslots*: Live message plaque typing with custom bakery kitchen dispatch scheduling (*Morning*, *Afternoon*, *Evening*, *Midnight Surprise*).
  - **Dynamic 2D/3D Layer Cake Visualizer**: Renders cake colors, tier geometries (1, 2, or 3 tiers), and chocolate message plaque in real time.
  - **Itemized Dynamic Price Engine & Direct Cart Booking**: Real-time cost updates and seamless 1-click addition to shopping cart with custom modal confirmation.

For full technical details, see the [Day 7 Progress Report](docs/DAY-07-REPORT.md).

---

## 🚀 Day 6 Achievements

- **Dedicated B2B & Corporate Bulk Order Suite (Problems #3, #7, #8, #9 Solved)**:
  - **Interactive Volume Pricing Estimator**: Dynamic tier calculator for corporate gifting curations (25 to 1,500+ boxes) with 4 transparent discount tiers (10% to 30% OFF) and live per-box effective rate breakdown.
  - **Corporate Co-Branding & Keepsake Tin Mockup Studio**: 3D-effect virtual tin visualizer with live company name embossing, custom tin finishes (Gold, Burgundy, Navy, Emerald), and company logo upload simulator.
  - **Instant GST Pro-Forma Quotation Generator**: Formal tax invoice generator with 15-digit GSTIN format validation, HSN code classification, CGST/SGST tax split, formal legal terms, and 1-click "Print / Save PDF" output.
  - **Executive Tasting Sample Kit**: Low-friction 4-sample luxury curation kit (₹499) with 100% refund credit towards future bulk orders.

For full technical details, see the [Day 6 Progress Report](docs/DAY-06-REPORT.md).

---

## 🚀 Day 5 Achievements (Mid-Sprint Milestone 🏁)

- **Side-by-Side Delicacy Comparison (Problem #13 Solved)**:
  - **In-Card Quick Compare Button**: Added `⚖️ Compare` toggles on all 16 catalog delicacies with live feedback (`✓ Compared`).
  - **Persistent Floating Comparison Bottom Dock**: Sleek dark burgundy & gold drawer sliding up as soon as at least 1 delicacy is selected (supports up to 4 items simultaneously). Includes delicacy thumbnail chips, names, prices, and 1-click remove triggers.
  - **Header Navbar Badge**: Live badge on the top header `⚖️ Compare` button allowing instant opening of the comparison matrix from anywhere on the site.
  - **12-Dimension Side-by-Side Comparison Matrix Modal**: Comprehensive comparison table evaluating selected items across:
    1. Delicacy Thumbnail & Title (with remove trigger)
    2. Culinary Category & Heritage Badges
    3. Price & Discount
    4. **Standardized Value Metric (Price per 100g)** (e.g. ₹55.0 / 100g)
    5. Unit Pack Size & Net Quantity
    6. Shelf Life & Freshness Guarantee
    7. Customer Ratings & Verified Review Counts
    8. Dietary Profiles (*Veg, Eggless, Vegan, Sugar-Free, Gluten-Free, Nut-Free*)
    9. Packaging Standards & Keepsake Tins
    10. Full Ingredients Breakdown
    11. Allergen Profile & Declarations
    12. Nutritional Energy (kcal) & Added Sugars (g)
    13. Ideal Occasions & Pairing Suggestions
    14. Direct 1-Click "Add to Cart" button inside each comparison column!

For full technical details, see the [Day 5 Progress Report](docs/DAY-05-REPORT.md).

---

## 🚀 Day 4 Achievements

- **Standardized Product Detail (PDP) Modal (Problem #7 Solved)**:
  - Deep-dive product lightbox modal for all 16 catalog delicacies with high-resolution visual placeholders and authentic Est. 1953 badges.
  - **Standardized Technical Specifications Matrix**: Unit weight, shelf-life guarantee, packaging standards, and FSSAI License Number (13615015000254).
  - **Standardized Nutritional Information Panel (per 100g)**: Calories, carbohydrates, added sugars, fats, and protein.
  - **Complete Ingredients & Allergen Transparency Box**: Clear allergen warnings highlighting wheat, dairy, tree nuts, or peanuts.
  - **Interactive Purchasing Deck**: Quantity counter `(-) [ 1 ] (+)` with dynamic subtotal recalculation and direct Add to Cart.
- **Smart Cross-Selling & Recommendations Engine (Problem #14 Solved)**:
  - **"Frequently Bought Together" Combo Card**: Curated companion delicacy pairings with exclusive bundle savings (e.g., Save ₹30 to ₹120) and 1-click "Add Both to Cart".
  - **"Customers Also Relished" Cross-Sell Grid**: Curated suggestions with 1-click quick add.

For full technical details, see the [Day 4 Progress Report](docs/DAY-04-REPORT.md).

---

## 🚀 Day 3 Achievements

- **Multi-Faceted Search & Advanced Filtering Hub (Problem #2 Solved)**:
  - **Real-Time Synchronized Search**: Bi-directional live filtering across titles, categories, and ingredients with instant 1-click clear button.
  - **Popular Query Suggestions**: 1-click search tags (*Fruit Biscuit*, *Osmania*, *Kaju Katli*, *Sugar-Free*, *Dark Truffle*, *Luxury Hampers*, *Millet Crisp*).
  - **Dietary Multi-Select Facet Chips**: Multi-select pills for *100% Veg / Eggless*, *Vegan*, *Sugar-Free / Stevia*, *Gluten-Free*, and *Nut-Free*.
  - **Interactive Price Range Slider & Presets**: Dynamic budget slider (₹140–₹2,000) with quick budget buttons (*All Prices*, *Under ₹250*, *Under ₹500*, *Under ₹800*).
  - **Multi-Criteria Sort Engine**: Bestsellers, Price Low/High, Rating, and Delicacy Name.
  - **Active Filter Chips Bar**: Summary of active criteria with individual removal and master *Reset All* button.
  - **Zero-Results Smart Fallback State**: Contextual adjustment advice and 1-click quick-add for Hyderabad's 4 iconic bestsellers.

For full technical details, see the [Day 3 Progress Report](docs/DAY-03-REPORT.md).

---

## 🚀 Day 2 Achievements

- **5 Signature Culinary Pillars (Problem #1 Solved)**: Consolidated 30+ fragmented and cluttered categories into 5 master pillars: *Iconic Biscuits*, *Artisanal Cakes*, *Royal Mithai*, *Luxury Hampers*, and *Healthy & Savoury*.
- **Interactive Visual Mega Menu (Problem #15 Solved)**: Multi-column desktop mega menu with starting prices, badges (*Legend*, *Pure Ghee*, *Stevia 🍃*), and an embedded *Collector's Edition Spotlight Card* with direct Quick Add to Cart.
- **Mobile Off-Canvas Navigation Drawer**: Touch-friendly accordion taxonomy and customer journey quick switcher for smartphone users.
- **Responsive Real-Time Search Bar**: Live search across 16 delicacies with instant catalog filtering and Enter-key smooth scroll.
- **Expanded 16-Product Catalog Grid**: Fresh bakes with dietary indicators, unit weights, pricing specs, and working cart counter badges.

For full technical details, see the [Day 2 Progress Report](docs/DAY-02-REPORT.md).

---

## 🚀 Day 1 Achievements

- **Unified Online Experience (Problem #4 Solved)**: Merged the disconnected shopping experience into one seamless website.
- **Customer Journey Switcher (Problem #15 Solved)**: Clear, accessible gateways for **Retail B2C**, **Corporate B2B**, **Custom Cake Studio**, and **Store Locator**.
- **Heritage Design System**: Royal Burgundy (`#720E1E`), Heritage Gold (`#C99726`), warm cream aesthetic, and responsive Google Typography (`Playfair Display` + `Outfit`).
- **Express Pincode Delivery Validator**: Pre-checkout validation distinguishing local same-day bakes from 3–5 day pan-India shipping.

For full technical details, see the [Day 1 Progress Report](docs/DAY-01-REPORT.md).

---


---

## 🍃 MongoDB Atlas Cloud Database Integration

The platform includes a production-grade **MongoDB NoSQL Cloud Architecture** running via **Vercel Serverless Functions (`/api/`)**:

### 1. Database Collections Schema
- **`orders`**: Customer checkout records, payment statuses (UPI, COD, Card), and live kitchen-to-dispatch tracking stages.
- **`products`**: Catalog items, active prices, inventory stock status (`inStock` / `soldOut`), nutritional facts, and allergen tags.
- **`stores`**: 54 verified outlet records across 9 Indian metro regions with geo-coordinates and amenities.
- **`reviews`**: Customer star ratings, review headlines, verified buyer badges, and feedback text.
- **`b2b_inquiries`**: Corporate bulk orders, enterprise leads (Google, Infosys, Deloitte), GSTINs, and quotation statuses.

### 2. Serverless API Endpoints
- `GET /api/health`: Diagnostic endpoint reporting MongoDB connection status, latency (ms), and active collections.
- `GET /api/razorpay` & `POST /api/razorpay`: Razorpay gateway configuration retrieval, order creation (`create_order` in paise), and HMAC-SHA256 signature verification (`verify_payment`).
- `GET /api/orders` & `POST /api/orders` & `PATCH /api/orders`: Order placement, retrieval, and kitchen dispatch status progression.
- `GET /api/products` & `POST /api/products` & `PATCH /api/products`: Catalog retrieval, delicacy publisher, and live stock/price overrides.
- `GET /api/reviews` & `POST /api/reviews`: Customer 5-star review submission and display.
- `GET /api/stores` & `POST /api/stores`: Query 54 verified outlets by city and type.
- `GET /api/b2b` & `POST /api/b2b`: Corporate quote inquiries pipeline.
- `POST /api/seed`: 1-click database initialization seeding collections with products and stores.

### 3. How to Connect Your Free MongoDB Atlas Cluster & Razorpay Keys
1. Create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and deploy a free **M0 Shared Cluster** (AWS Mumbai).
2. Create a Database User with password under **Database Access**.
3. Allow IP access from anywhere (`0.0.0.0/0`) under **Network Access** (required for Vercel Serverless).
4. Add the following in **Vercel Dashboard ➔ Project Settings ➔ Environment Variables**:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/karachi_bakery?retryWrites=true&w=majority
   RAZORPAY_KEY_ID=rzp_test_... (or your live key)
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```
5. Click **Redeploy**. The application automatically connects to both the cloud database and active Razorpay gateway! (Alternatively, keys can be configured directly in the Admin Operations Portal without redeploying).

## 💻 How to Run Locally

Simply clone and open `index.html` in any browser, or use the local server:

```bash
git clone https://github.com/SamudralaHitesh/Karachi-Bakery-Website-Redesign.git
cd Karachi-Bakery-Website-Redesign
npm install
npm run dev
# Accepting connections at http://localhost:3000
```

---

## 🌐 Live Vercel Deployment

This project is pre-configured for instant **Vercel** deployment with optimized headers and clean routing (`vercel.json`).

### Option 1: 1-Click Git Integration (Recommended)
1. Go to [vercel.com/new](https://vercel.com/new) and log in with your GitHub account.
2. Select repository: `SamudralaHitesh/Karachi-Bakery-Website-Redesign`.
3. Keep default settings (Framework Preset: **Other**) and click **Deploy**.
4. Every future commit to `main` will automatically deploy live with zero extra setup!

### Option 2: Deploy via Vercel CLI
```bash
npx vercel
```
