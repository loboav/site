import { useState, useEffect, ChangeEvent } from "react";
import api from '../apiClient';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  categoryId?: string;
}

interface Category {
  id: string;
  name: string;
}

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", description: "", stock: "", categoryId: "" });
  const [newProductImage, setNewProductImage] = useState<File | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editProductImage, setEditProductImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [newCategory, setNewCategory] = useState("");

  // Получаем список продуктов
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  async function fetchProducts() {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (err) {
      setError("Ошибка загрузки продуктов");
    }
  }

  async function fetchCategories() {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (err) {
      setError("Ошибка загрузки категорий");
    }
  }

  // Добавление нового продукта
  async function handleAddProduct() {
    if (!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.stock || !newProduct.categoryId) {
      setError('Все поля обязательны для заполнения');
      return;
    }

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("stock", newProduct.stock);
    formData.append("categoryId", newProduct.categoryId);
    if (newProductImage) {
      formData.append("image", newProductImage);
    }

    try {
      await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setNewProduct({ name: "", price: "", description: "", stock: "", categoryId: "" });
      setNewProductImage(null);
      fetchProducts();
    } catch (err) {
      setError("Ошибка добавления продукта");
    }
  }

  // Удаление продукта
  async function handleDeleteProduct(id: number) {
    try {
      await api.delete(`/products/${id}`);
      fetchProducts(); // Обновляем список
    } catch (err) {
      setError("Ошибка удаления продукта");
    }
  }

  // Изменение продукта
  async function handleEditProduct() {
    if (!editProduct || !editProduct.name || !editProduct.price || !editProduct.description || editProduct.stock === undefined || !editProduct.categoryId) {
      setError('Все поля обязательны для заполнения');
      return;
    }

    const formData = new FormData();
    formData.append("name", editProduct.name);
    formData.append("price", editProduct.price.toString());
    formData.append("description", editProduct.description);
    formData.append("stock", editProduct.stock.toString());
    formData.append("categoryId", editProduct.categoryId);
    if (editProductImage) {
      formData.append("image", editProductImage);
    }

    try {
      await api.patch(`/products/${editProduct.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setEditProduct(null);
      setEditProductImage(null);
      fetchProducts();
    } catch (err) {
      setError("Ошибка изменения продукта");
    }
  }

  async function handleAddCategory() {
    if (!newCategory.trim()) return;
    try {
      await api.post("/categories", { name: newCategory });
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      setError("Ошибка добавления категории");
    }
  }

  async function handleDeleteCategory(id: string) {
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      setError("Ошибка удаления категории");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Админ Панель</h1>

      {error && <p className="text-red-500">{error}</p>}

      {/* Раздел управления категориями */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Категории</h2>
        <div className="flex mb-2">
          <input
            type="text"
            placeholder="Новая категория"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            className="border p-2 mr-2"
          />
          <button className="bg-green-500 text-white px-4 py-2" onClick={handleAddCategory}>
            Добавить
          </button>
        </div>
        <ul>
          {categories.map(cat => (
            <li key={cat.id} className="flex items-center mb-1">
              <span className="mr-2">{cat.name}</span>
              <button className="bg-red-500 text-white px-2 py-1 text-xs" onClick={() => handleDeleteCategory(cat.id)}>
                Удалить
              </button>
            </li>
          ))}
        </ul>
      </div>

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
        <input
          type="number"
          placeholder="Количество"
          value={newProduct.stock || ""} // Убедимся, что значение всегда строка
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewProduct({ ...newProduct, stock: e.target.value })
          }
          className="border p-2 mr-2"
        />
        <select
          value={newProduct.categoryId}
          onChange={e => setNewProduct({ ...newProduct, categoryId: e.target.value })}
          className="border p-2 mr-2"
          required
        >
          <option value="">Выберите категорию</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
              setNewProductImage(e.target.files[0]);
            }
          }}
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
          <select
            value={editProduct.categoryId || ""}
            onChange={e => setEditProduct({ ...editProduct, categoryId: e.target.value })}
            className="border p-2 mr-2"
            required
          >
            <option value="">Выберите категорию</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.files) {
                setEditProductImage(e.target.files[0]);
              }
            }}
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
