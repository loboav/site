import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

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
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data)); // Указываем, что `data` - массив `Product`
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
