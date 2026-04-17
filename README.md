# 🌿 EcoHabit — Sustainable Home Goods Marketplace

<div align="center">

![EcoHabit Banner](https://img.shields.io/badge/EcoHabit-Sustainable%20Marketplace-2d5a27?style=for-the-badge&logo=leaf&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**An online store specializing in eco-friendly household alternatives.**
*Bamboo cleaning supplies · Biodegradable kitchenware · Reusable storage · Eco cleaning agents*

[🛍️ Features](#-features) · [🚀 Getting Started](#-getting-started) · [📁 Project Structure](#-project-structure) · [🔌 API Reference](#-api-reference) · [📸 Screenshots](#-screenshots)

</div>

---

## 📌 Overview

EcoHabit is a full-stack sustainable home goods marketplace built with **NestJS** (backend) and **Vanilla HTML/CSS/JS** (frontend). It allows users to browse eco-friendly products, manage a shopping cart, place orders, and track order history — all without any external database dependency (powered by in-memory JSON storage).

---

## ✨ Features

### 🛒 Shopping Experience
- Browse **16 curated eco-friendly products** across 4 categories
- Advanced **search, filter by category, price range, and sort** options
- Detailed **product modal** with eco score meter, materials, and ratings
- **Animated hero section** with floating UI elements

### 🧺 Cart & Checkout
- **Session-based cart** — persists across page refreshes
- Real-time **quantity controls** (increase, decrease, remove)
- **GST calculation** (5%) and free shipping above ₹999
- Full **checkout form** with validation
- **Order confirmation** page with order summary

### 📦 Orders
- Complete **order history** per session
- Order status tracking (Pending → Confirmed → Shipped → Delivered)
- Detailed per-order item breakdown

### 🎨 UI/UX
- Fully **responsive design** (mobile, tablet, desktop)
- **Skeleton loading** states for smooth experience
- **Toast notifications** for all user actions
- **Multi-page SPA** feel without any framework
- Beautiful green-earth design system with CSS variables

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend Framework | NestJS 10 + TypeScript |
| Database | In-Memory JSON (no external DB) |
| Frontend | HTML5 + CSS3 + Vanilla JavaScript |
| Fonts | Google Fonts (Playfair Display + DM Sans) |
| API Style | RESTful |
| Session Management | Custom header (`x-session-id`) |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

```bash
node --version   # v18 or higher recommended
npm --version    # v9 or higher
```

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ecohabit.git
cd ecohabit
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start development server (with hot-reload)
npm run start:dev
```

✅ API will be live at: `http://localhost:3000/api`

### 3. Frontend Setup

```bash
# Navigate to frontend
cd ../frontend

# Simply open in your browser — no build step needed!
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

✅ Or just **double-click** `index.html` in your file explorer.

> ⚠️ **Important:** Make sure the backend is running on port `3000` before opening the frontend.

---

## 🔌 API Reference

### Base URL
```
http://localhost:3000/api
```

### 📦 Products

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| `GET` | `/products` | Get all products | `category`, `search`, `minPrice`, `maxPrice`, `sort`, `featured` |
| `GET` | `/products/:id` | Get single product | — |
| `GET` | `/products/featured` | Get featured products | — |
| `GET` | `/products/stats` | Get product statistics | — |
| `GET` | `/products/category/:category` | Get by category | — |

**Sort options:** `price-asc` · `price-desc` · `rating` · `eco-score` · `newest`

**Example:**
```bash
GET /api/products?category=bamboo-cleaning&sort=rating&maxPrice=1000
```

---

### 🗂️ Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/categories` | Get all categories |
| `GET` | `/categories/:id` | Get single category |

---

### 🛒 Cart

> All cart endpoints require the `x-session-id` header.

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `GET` | `/cart` | Get cart with totals | — |
| `POST` | `/cart/add` | Add item to cart | `{ productId, quantity }` |
| `PUT` | `/cart/update/:cartItemId` | Update quantity | `{ quantity }` |
| `DELETE` | `/cart/remove/:cartItemId` | Remove item | — |
| `DELETE` | `/cart/clear` | Clear entire cart | — |

**Example:**
```bash
POST /api/cart/add
Headers: x-session-id: sess_abc123
Body: { "productId": "p001", "quantity": 2 }
```

---

### 📋 Orders

> All order endpoints require the `x-session-id` header.

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/orders` | Place a new order | `{ customerInfo }` |
| `GET` | `/orders/my-orders` | Get session's orders | — |
| `GET` | `/orders/:id` | Get single order | — |

**Example:**
```bash
POST /api/orders
Headers: x-session-id: sess_abc123
Body:
{
  "customerInfo": {
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "address": "42 Green Street",
    "city": "Chennai",
    "pincode": "600001"
  }
}
```

---

## 🗃️ Product Categories

| Category ID | Name | Products |
|-------------|------|----------|
| `bamboo-cleaning` | 🎋 Bamboo Cleaning Supplies | Dish brush, scrub pads, toilet brush, cleaning cloths |
| `biodegradable-kitchenware` | 🍃 Biodegradable Kitchenware | Wheat straw set, bamboo cups, sugarcane plates, palm bowls |
| `reusable-storage` | ♻️ Reusable Storage Solutions | Beeswax wraps, glass jars, produce bags, steel containers |
| `eco-cleaning-agents` | 🌿 Eco Cleaning Agents | All-purpose cleaner, dishwasher tabs, laundry strips, floor cleaner |

---

## 🌱 Eco Score System

Every product has an **Eco Score from 1–10** based on:

- 🌿 Biodegradability
- ♻️ Reusability
- 🌍 Sustainability of materials
- 🚫 Plastic-free packaging
- 🧪 Non-toxic ingredients

---

## 🧪 Available Scripts

### Backend

```bash
npm run start         # Start production server
npm run start:dev     # Start with hot-reload (development)
npm run build         # Compile TypeScript to dist/
npm run start:prod    # Run compiled production build
```

---

## 🔮 Future Improvements

- [ ] Add PostgreSQL / MongoDB for persistent storage
- [ ] User authentication (JWT)
- [ ] Product reviews and ratings system
- [ ] Admin dashboard for inventory management
- [ ] Payment gateway integration (Razorpay / Stripe)
- [ ] Email order confirmation (Nodemailer)
- [ ] PWA support for mobile
- [ ] Unit and E2E tests (Jest + Supertest)

```

Built with 💚 for a greener planet.

> *"Every sustainable choice, no matter how small, contributes to a healthier Earth."*

---

<div align="center">

🌍 **Live Green. Shop Smarter. Choose EcoHabit.**

⭐ If you found this project helpful, please give it a star on GitHub!

</div>
