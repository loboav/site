import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginType, setLoginType] = useState("client");
  const role = localStorage.getItem("role"); // Получаем роль из localStorage
  const navigate = useNavigate();

  return (
    <>
      {/* Фиксированный белый Header */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md p-4 flex justify-between items-center z-50">
        <Link to="/" className="text-xl font-bold text-yellow-600 no-underline hover:no-underline">
          My Honey Shop 🍯
        </Link>
        <div className="flex items-center space-x-6">
          {/* Добавляем почту */}
          <a href="mailto:lobovp@yandex.ru" className="text-gray-700 hover:underline">
            lobovp@yandex.ru
          </a>
          {/* Добавляем время работы */}
          <span className="text-gray-700">08:00 - 20:00</span>
          {/* Добавляем номер телефона */}
          <a href="tel:+375296860961" className="text-gray-700 hover:underline">
            +375 29 686-09-61
          </a>
        </div>
        <div>
          {role === "admin" && (
            <Link
              to="/admin"
              className="mr-4 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              AdminPanel
            </Link>
          )}
          {role ? (
            <button
              className="mr-4 bg-red-500 text-white px-4 py-2 rounded"
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
                className="mr-4 bg-blue-500 text-white px-4 py-2 rounded" 
                onClick={() => setShowLoginModal(true)}
              >
                Войти
              </button>
              <button 
                className="bg-green-500 text-white px-4 py-2 rounded" 
                onClick={() => navigate("/register")}
              >
                Зарегистрироваться
              </button>
            </>
          )}
        </div>
      </header>

      {/* Жёлтая лента, которая не прокручивается и занимает всю ширину */}
      <nav className="sticky top-[64px] left-0 w-screen bg-yellow-400 p-3 shadow-md z-40">
        <ul className="flex justify-center space-x-4">
          <li><Link to="/category/honey" className="text-white">Мёд</Link></li>
          <li><Link to="/category/jam" className="text-white">Варенье</Link></li>
          <li><Link to="/category/gifts" className="text-white">Подарки</Link></li>
          <li><Link to="/cart" className="text-white font-bold">🛒 Корзина</Link></li>
        </ul>
      </nav>

      {/* Добавим отступ, чтобы контент не заезжал под меню */}
      <div className="mt-24"></div>

      {/* Модальное окно только для входа */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Выберите вход</h2>
            <div className="flex space-x-2 mb-4">
              <button 
                className={`p-2 flex-1 rounded ${loginType === "client" ? "bg-blue-500 text-white" : "bg-gray-200"}`} 
                onClick={() => setLoginType("client")}
              >
                Клиент
              </button>
              <button 
                className={`p-2 flex-1 rounded ${loginType === "company" ? "bg-blue-500 text-white" : "bg-gray-200"}`} 
                onClick={() => setLoginType("company")}
              >
                Компания
              </button>
            </div>
            <Link to={`/login?type=${loginType}`} className="block bg-blue-600 text-white p-2 rounded text-center">Перейти ко входу</Link>
            <button className="mt-4 text-red-500" onClick={() => setShowLoginModal(false)}>Закрыть</button>
          </div>
        </div>
      )}
    </>
  );
}
