import { useState, useEffect } from "react";
import axios from "axios";

interface CartItem {
  id: string;
  product: {
    id: string; // Добавлено свойство id
    name: string;
    price: number;
  };
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const response = await axios.get("http://localhost:3000/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCartItems(response.data.items);
      calculateTotal(response.data.items);
    } catch (err) {
      console.error("Ошибка загрузки корзины:", err);
    }
  }

  function calculateTotal(items: CartItem[]) {
    const total = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    setTotalPrice(parseFloat(total.toFixed(2))); // Округляем до 2 знаков
  }

  async function updateQuantity(itemId: string, newQuantity: number) {
    try {
      const currentItem = cartItems.find(item => item.id === itemId);
      if (!currentItem) {
        console.error("Товар не найден в корзине.");
        return;
      }

      if (!currentItem.product.id) {
        console.error("ID продукта отсутствует.");
        return;
      }

      if (newQuantity <= 0) {
        console.log("Удаление товара из корзины:", { itemId }); // Логируем данные
        await axios.delete(`http://localhost:3000/cart/${itemId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
      } else {
        console.log("Обновление количества:", {
          productId: currentItem.product.id,
          quantity: newQuantity - currentItem.quantity,
        }); // Логируем данные
        await axios.post(
          "http://localhost:3000/cart/add",
          { productId: currentItem.product.id, quantity: newQuantity - currentItem.quantity },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
      }
      calculateTotal(cartItems);
    } catch (err) {
      console.error("Ошибка обновления количества:", err);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Корзина</h1>
      {cartItems.length === 0 ? (
        <p>Ваша корзина пуста.</p>
      ) : (
        <div>
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center border p-4 rounded"
              >
                <div>
                  <h2 className="text-lg font-semibold">{item.product.name}</h2>
                  <p>Цена: {item.product.price} руб.</p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="px-2 py-1 bg-green-500 text-white rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="text-lg font-bold">
                  Сумма: {(item.product.price * item.quantity).toFixed(2)} руб.
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-6 text-right">
            <h2 className="text-xl font-bold">Общая стоимость: {totalPrice.toFixed(2)} руб.</h2>
          </div>
        </div>
      )}
    </div>
  );
}