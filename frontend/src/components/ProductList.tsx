import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import api from '../apiClient';

// Определяем интерфейс для продукта
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]); // Задаем массив продуктов

  useEffect(() => {
    api.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Ошибка загрузки продуктов:", err));
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
