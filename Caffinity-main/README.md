# 🛒 Ecommerce Frontend Application

A modern **E-commerce Frontend** built with **React + TypeScript + Vite**, following clean architecture principles, reusable UI components, and scalable folder structure. The project focuses on performance, maintainability, and real-world ecommerce features such as authentication, protected routes, cart management, checkout flow, and product collections.

---

## 🚀 Tech Stack

* **React 18**
* **TypeScript**
* **Vite** (Fast build tool)
* **React Router**
* **Context API** (State management)
* **Tailwind CSS** (Styling)
* **ESLint** (Code quality)

---

## ✨ Features

* 🏠 Home, Collections & Product Details pages
* 🔐 Authentication (Login / Sign Up)
* 🛡 Protected Routes
* 🛒 Shopping Cart with Overlay
* 💳 Checkout Flow (Delivery & Payment)
* 🔍 Search Overlay
* 📦 Order Confirmation
* 📱 Fully responsive UI

---

## 📂 Project Structure

```bash
src/
├── assets/
│   └── svg/
│       └── add-to-shopping-bag.svg
│
├── components/
│   ├── ui/                  
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── CartOverlay.tsx
│   ├── SearchOverlay.tsx
│   └── RootLayout.tsx
│
├── contexts/                 
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   └── SearchContext.tsx
│
├── data/
│   └── drinks_menu.json    
│
├── lib/
│   └── utils.ts             
│
├── pages/                   
│   ├── HomePage.tsx
│   ├── CollectionsPage.tsx
│   ├── ColdDrinksPage.tsx
│   ├── HotDrinksPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CartPage.tsx
│   ├── CheckoutDeliveryPage.tsx
│   ├── CheckoutPaymentPage.tsx
│   ├── OrderConfirmationPage.tsx
│   ├── LoginPage.tsx
│   ├── SignUpPage.tsx
│   ├── AccountPage.tsx
│   ├── ContactPage.tsx
│   ├── PlaceholderPage.tsx
│   └── RouteErrorPage.tsx
│
├── router/
│   ├── index.tsx             
│   └── ProtectedRoute.tsx    
│
├── types/
│   └── index.ts             
│
├── utils/
│   └── migrateUsers.ts      
│
├── App.tsx                  
├── main.tsx                 
├── index.css                 
└── vite-env.d.ts
```

---

## 🔐 Authentication & Authorization

* Authentication state is handled using **AuthContext**
* Protected pages are wrapped using `ProtectedRoute`
* User session logic is centralized for scalability

---

## 🛒 Cart & Checkout

* Global cart state using **CartContext**
* Add / Remove products from anywhere
* Cart Overlay for quick access
* Multi-step checkout process

---

## 🧠 State Management

* Built with **React Context API**
* Separate contexts for:

  * Authentication
  * Cart
  * Search

This keeps logic modular and easy to maintain.

---

## 🧪 Scripts

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📦 Installation

```bash
git clone https://github.com/zeyadhanydev/ecommerce.git
cd ecommerce
npm install
npm run dev
```

---

## 📌 Notes

* This project is frontend-focused and uses mock data
* Designed to be easily connected to a real backend
* Clean, scalable structure suitable for real-world ecommerce apps


---

⭐ If you like this project, don’t forget to give it a star!
