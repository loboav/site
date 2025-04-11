import axios from "axios";
import { useState } from "react";
import Modal from "./Modal.tsx"; // Убедимся, что путь к Modal корректен
import { Link } from "react-router-dom"; // Импортируем Link для навигации

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

      await axios.post(
        "http://localhost:3000/cart/add",
        { productId: product.id, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
    <div className="border rounded-lg p-4 shadow-md">
      <img
        src={product.image ? `http://localhost:3000${product.image}` : "/images/default-honey.jpg"}
        alt={product.name}
        className="w-full h-40 object-cover rounded"
      />
      <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
      <p className="text-yellow-600 font-bold">{product.price} руб.</p>
      <p
        className={`text-sm ${
          product.stock > 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        {product.stock > 0
          ? `В наличии: ${product.stock} шт.`
          : "Нет в наличии"}
      </p>
      <Link
        to={`/product/${product.id}`}
        className="block bg-yellow-500 text-white text-center py-2 mt-3 rounded"
      >
        Подробнее
      </Link>
      {product.stock > 0 && (
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="block bg-green-500 text-white text-center py-2 mt-3 rounded w-full"
        >
          {isAdding ? "Добавление..." : "Купить"}
        </button>
      )}

      {/* Модальное окно */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-4">
            <img
              src={product.image ? `http://localhost:3000${product.image}` : "/images/default-honey.jpg"}
              alt={product.name}
              className="w-full h-40 object-cover rounded mb-4"
            />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-yellow-600 font-bold">{product.price} руб.</p>
            <p className="text-sm mt-2">{product.description}</p>
            <div className="mt-4">
              <button
                onClick={handleAddToCart}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Добавить в корзину
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
