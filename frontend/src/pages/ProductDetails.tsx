import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

// Определяем интерфейс для продукта
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  description?: string;
}

export default function ProductDetails() {
  const { id } = useParams(); // Получаем ID товара из URL
  const [product, setProduct] = useState<Product | null>(null); // Указываем тип Product | null
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Загружаем данные о товаре
    axios
      .get(`${import.meta.env.VITE_API_URL}/products/${id}`)
      .then((response) => setProduct(response.data))
      .catch((error) => console.error("Ошибка загрузки товара:", error));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return; // Проверяем, что product не равен null

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Пожалуйста, войдите в аккаунт, чтобы добавить товар в корзину.");
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/cart/add`,
        { productId: product.id, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => alert("Товар добавлен в корзину!"))
      .catch((error) => {
        console.error("Ошибка добавления в корзину:", error);
        alert("Не удалось добавить товар в корзину. Попробуйте снова.");
      });
  };

  if (!product) {
    return <p>Загрузка...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row items-center">
        <img
          src={product.image ? `http://localhost:3000${product.image}` : "/images/default-honey.jpg"}
          alt={product.name}
          className="w-full md:w-1/2 h-auto object-cover rounded"
        />
        <div className="md:ml-8 mt-4 md:mt-0">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-yellow-600 text-2xl font-bold mb-4">
            {product.price} руб.
          </p>
          <p className="text-gray-700 mb-4">{product.description || "Описание отсутствует."}</p>
          <div className="flex items-center mb-4">
            <label htmlFor="quantity" className="mr-2 font-semibold">
              Количество:
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              className="border p-2 w-20 text-center"
            />
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Добавить в корзину
          </button>
        </div>
      </div>
    </div>
  );
}