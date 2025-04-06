import { useState, useEffect } from "react";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number; // Добавлено поле stock
}

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", description: "" });
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");

  // Получаем список продуктов
  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const response = await axios.get("http://localhost:3000/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProducts(response.data);
    } catch (err) {
      setError("Ошибка загрузки продуктов");
    }
  }

  // Добавление нового продукта
  async function handleAddProduct() {
    if (!newProduct.name || !newProduct.price || !newProduct.description) {
      setError('Все поля обязательны для заполнения');
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/products",
        {
          name: newProduct.name,
          price: parseFloat(newProduct.price), // Преобразуем цену в число
          stock: 100, // Укажите значение по умолчанию, если нужно
          category: "Мёд", // Укажите категорию по умолчанию
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNewProduct({ name: "", price: "", description: "" });
      fetchProducts(); // Обновляем список
    } catch (err) {
      setError("Ошибка добавления продукта");
    }
  }

  // Удаление продукта
  async function handleDeleteProduct(id: number) {
    try {
      await axios.delete(`http://localhost:3000/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchProducts(); // Обновляем список
    } catch (err) {
      setError("Ошибка удаления продукта");
    }
  }

  // Изменение продукта
  async function handleEditProduct() {
    if (!editProduct || !editProduct.name || !editProduct.price || !editProduct.description || editProduct.stock === undefined) {
      setError('Все поля обязательны для заполнения');
      return;
    }

    try {
      await axios.patch(
        `http://localhost:3000/products/${editProduct.id}`,
        {
          name: editProduct.name,
          price: editProduct.price,
          stock: editProduct.stock, // Добавлено поле stock
          category: "Мёд", // Укажите категорию по умолчанию
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEditProduct(null);
      fetchProducts(); // Обновляем список
    } catch (err) {
      setError("Ошибка изменения продукта");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Админ Панель</h1>

      {error && <p className="text-red-500">{error}</p>}

      {/* Форма добавления */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Добавить продукт</h2>
        <input
          type="text"
          placeholder="Название"
          value={newProduct.name || ""} // Убедимся, что значение всегда строка
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Цена"
          value={newProduct.price || ""} // Убедимся, что значение всегда строка
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Описание"
          value={newProduct.description || ""} // Убедимся, что значение всегда строка
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
          className="border p-2 mr-2"
        />
        <button className="bg-blue-500 text-white px-4 py-2" onClick={handleAddProduct}>
          Добавить
        </button>
      </div>

      {/* Таблица продуктов */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Название</th>
            <th className="border p-2">Цена</th>
            <th className="border p-2">Описание</th>
            <th className="border p-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border">
              <td className="border p-2">{product.id}</td>
              <td className="border p-2">{product.name}</td>
              <td className="border p-2">{product.price} ₽</td>
              <td className="border p-2">{product.description}</td>
              <td className="border p-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 mr-2"
                  onClick={() => setEditProduct(product)}
                >
                  Изменить
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Форма редактирования */}
      {editProduct && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Редактировать продукт</h2>
          <input
            type="text"
            value={editProduct?.name || ""} // Убедимся, что значение всегда строка
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEditProduct({ ...editProduct, name: e.target.value })
            }
            className="border p-2 mr-2"
          />
          <input
            type="number"
            value={editProduct?.price || ""} // Убедимся, что значение всегда строка
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEditProduct({ ...editProduct, price: +e.target.value })
            }
            className="border p-2 mr-2"
          />
          <input
            type="number"
            placeholder="Количество"
            value={editProduct?.stock || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEditProduct({ ...editProduct, stock: +e.target.value })
            }
            className="border p-2 mr-2"
          />
          <input
            type="text"
            value={editProduct?.description || ""} // Убедимся, что значение всегда строка
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEditProduct({ ...editProduct, description: e.target.value })
            }
            className="border p-2 mr-2"
          />
          <button className="bg-green-500 text-white px-4 py-2" onClick={handleEditProduct}>
            Сохранить
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 ml-2"
            onClick={() => setEditProduct(null)}
          >
            Отмена
          </button>
        </div>
      )}
    </div>
  );
}
