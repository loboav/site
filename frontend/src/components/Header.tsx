import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from '../apiClient';

interface Category {
  id: string;
  name: string;
}

export default function Header() {
  const [categories, setCategories] = useState<Category[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    api.get("/categories")
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  // Определяем выбранную категорию из url
  const selectedCategoryId = location.pathname.startsWith("/category/")
    ? location.pathname.replace("/category/", "")
    : null;

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white shadow-md p-4 flex justify-between items-center z-50">
        <Link to="/" className="text-2xl font-bold text-yellow-400 no-underline hover:no-underline tracking-wide drop-shadow-md">
          My Honey Shop <span role="img" aria-label="honey">🍯</span>
        </Link>
        <div className="flex items-center space-x-6">
          <a href="mailto:lobovp@yandex.ru" className="text-white hover:text-yellow-400 transition-colors">lobovp@yandex.ru</a>
          <span className="text-black">08:00 - 20:00</span>
          <a href="tel:+375296860961" className="text-black hover:text-yellow-400 transition-colors">+375 29 686-09-61</a>
        </div>
        <div>
          {role === "admin" && (
            <Link
              to="/admin"
              className="mr-4 bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-500 transition-colors"
            >
              AdminPanel
            </Link>
          )}
          {role ? (
            <button
              className="mr-4 bg-black text-white px-4 py-2 rounded font-semibold hover:bg-gray-800 transition-colors"
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
            >
              Выйти
            </button>
          ) : (
            <>
              <button 
                className="mr-4 bg-black text-white px-4 py-2 rounded font-semibold hover:bg-gray-800 transition-colors" 
                onClick={() => navigate("/login")}
              >
                Войти
              </button>
              <button 
                className="bg-black text-white px-4 py-2 rounded font-semibold border border-black hover:bg-gray-800 hover:text-white transition-colors" 
                onClick={() => navigate("/register")}
              >
                Зарегистрироваться
              </button>
            </>
          )}
        </div>
      </header>

      {/* Жёлтая лента с динамическими категориями */}
      <nav className="sticky top-[64px] left-0 w-screen bg-yellow-400 p-3 shadow-md z-40">
        <ul className="flex flex-wrap justify-center space-x-4">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                to={`/category/${cat.id}`}
                className={`text-black font-semibold hover:underline whitespace-nowrap ${selectedCategoryId === cat.id ? 'underline font-bold' : ''}`}
              >
                {cat.name}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/cart" className="text-black font-bold hover:underline whitespace-nowrap">🛒 Корзина</Link>
          </li>
        </ul>
      </nav>
      <div className="mt-24"></div>
    </>
  );
}
