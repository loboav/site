import { Link } from "react-router-dom";

// Определяем тип для продукта
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <img src={product.image || "/images/default-honey.jpg"} alt={product.name} className="w-full h-40 object-cover rounded" />
      <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
      <p className="text-yellow-600 font-bold">{product.price} руб.</p>
      <p className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
        {product.stock > 0 ? `В наличии: ${product.stock} шт.` : "Нет в наличии"}
      </p>
      <Link to={`/product/${product.id}`} className="block bg-yellow-500 text-white text-center py-2 mt-3 rounded">
        Подробнее
      </Link>
    </div>
  );
}
