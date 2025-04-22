import { useState } from "react";
import Modal from "./Modal.tsx"; // Убедимся, что путь к Modal корректен
import { Link } from "react-router-dom"; // Импортируем Link для навигации
import api from "../apiClient";
import { FaShoppingCart, FaInfoCircle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// Добавляем описание в интерфейс Product
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  description?: string; // Добавлено описание
}

export default function ProductCard({ product }: { product: Product }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Пожалуйста, войдите в аккаунт, чтобы добавить товар в корзину.");
        return;
      }
      await api.post(
        "/cart/add",
        { productId: product.id, quantity: 1 }
      );
      alert("Товар добавлен в корзину!");
    } catch (error) {
      console.error("Ошибка при добавлении товара в корзину:", error);
      alert("Не удалось добавить товар в корзину. Попробуйте снова.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      className="border rounded-lg p-4 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl bg-white"
    >
      <img
        src={product.image ? `${import.meta.env.VITE_API_URL}${product.image}` : "/images/default-honey.jpg"}
        alt={product.name}
        className="w-full h-40 object-cover rounded transition-transform duration-300 hover:scale-105"
      />
      <h3 className="text-lg font-semibold mt-2 text-black flex items-center gap-2">
        <FaInfoCircle className="text-yellow-400" />
        {product.name}
      </h3>
      <p className="text-yellow-600 font-bold flex items-center gap-1">
        <FaShoppingCart className="inline text-yellow-400" />
        {product.price} руб.
      </p>
      <p
        className={`text-sm flex items-center gap-1 ${
          product.stock > 0 ? "text-green-600" : "text-red-600"
        } text-black`}
      >
        {product.stock > 0 ? (
          <FaCheckCircle className="text-green-500" />
        ) : (
          <FaTimesCircle className="text-red-500" />
        )}
        {product.stock > 0
          ? `В наличии: ${product.stock} шт.`
          : "Нет в наличии"}
      </p>
      <Link
        to={`/product/${product.id}`}
        className="block bg-yellow-500 text-white text-center py-2 mt-3 rounded transition-transform duration-200 hover:scale-105 flex items-center justify-center gap-2"
      >
        <FaInfoCircle /> Подробнее
      </Link>
      {product.stock > 0 && (
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="block bg-black text-white text-center py-2 mt-3 rounded w-full transition-transform duration-200 hover:bg-gray-800 active:scale-95 flex items-center justify-center gap-2"
        >
          <FaShoppingCart /> {isAdding ? "Добавление..." : "Купить"}
        </button>
      )}

      {/* Модальное окно */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-4 animate-fade-in-up">
            <img
              src={product.image ? `${import.meta.env.VITE_API_URL}${product.image}` : "/images/default-honey.jpg"}
              alt={product.name}
              className="w-full h-40 object-cover rounded mb-4"
            />
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FaInfoCircle className="text-yellow-400" />
              {product.name}
            </h3>
            <p className="text-yellow-600 font-bold flex items-center gap-1">
              <FaShoppingCart className="inline text-yellow-400" />
              {product.price} руб.
            </p>
            <p className="text-sm mt-2">{product.description}</p>
            <div className="mt-4">
              <button
                onClick={handleAddToCart}
                className="bg-black text-white px-4 py-2 rounded transition-transform duration-200 hover:bg-gray-800 active:scale-95 flex items-center gap-2"
              >
                <FaShoppingCart /> Добавить в корзину
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
              >
                Закрыть
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
