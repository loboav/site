import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import api from '../apiClient';
import { useParams } from "react-router-dom";
import BannerCarousel from "../components/BannerCarousel";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  description?: string;
  categoryId?: string;
  category?: { id: string; name: string };
}

interface Category {
  id: string;
  name: string;
}

export default function Home() {
  const { categoryId } = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/categories").then(res => setCategories(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get("/products").then(res => {
      setProducts(res.data);
      setLoading(false);
    });
  }, []);

  // Если выбран фильтр по категории (страница /category/:id)
  const filteredProducts = categoryId
    ? products.filter(p => p.categoryId === categoryId)
    : products;

  // Если нет фильтра — группируем по категориям
  if (!categoryId) {
    return (
      <div className="container mx-auto p-4">
        {/* Карусель с баннерами */}
        <BannerCarousel />
        {categories.map(cat => {
          const catProducts = products.filter(p => p.categoryId === cat.id);
          if (catProducts.length === 0) return null;
          return (
            <div key={cat.id} className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                {cat.name}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {catProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          );
        })}
        {loading && <p>Загрузка...</p>}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Карусель с баннерами */}
      <BannerCarousel />
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        {categories.find(c => c.id === categoryId)?.name || "Товары"}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {filteredProducts.length === 0 && <p>Нет товаров в этой категории.</p>}
      {loading && <p>Загрузка...</p>}
    </div>
  );
}
