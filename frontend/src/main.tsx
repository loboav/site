import './index.css';
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CartPage from "./pages/CartPage";
import Header from "./components/Header";
import Footer from "./components/Footer"; // Импортируем подвал
import AdminPanel from "./pages/AdminPanel"; // Импортируем AdminPanel
import PromoPage from "./pages/PromoPage.tsx"; // Создаём страницу PromoPage
import ProductDetails from "./pages/ProductDetails"; // Импортируем страницу ProductDetails

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header /> {/* Шапка сайта */}
        <main className="flex-grow"> {/* Контейнер для контента, чтобы подвал оставался внизу */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/admin" element={<AdminPanel />} /> {/* Добавляем маршрут */}
            <Route path="/promo1" element={<PromoPage />} /> {/* Добавляем маршрут */}
            <Route path="/product/:id" element={<ProductDetails />} /> {/* Добавляем маршрут для ProductDetails */}
            <Route path="/category/:categoryId" element={<Home />} /> {/* Добавляем маршрут для категории */}
          </Routes>
        </main>
        <Footer /> {/* Подвал */}
      </div>
    </BrowserRouter>
  </React.StrictMode>
);