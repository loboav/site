import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  return (
    <>
      {/* Фиксированный белый Header */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md p-4 flex justify-between items-center z-50">
        <h1 className="text-xl font-bold text-yellow-600">My Honey Shop 🍯</h1>
        <div>
          <button 
            className="mr-4 bg-blue-500 text-white px-4 py-2 rounded" 
            onClick={() => setShowLoginModal(true)}
          >
            Войти
          </button>
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded" 
            onClick={() => setShowRegisterModal(true)}
          >
            Зарегистрироваться
          </button>
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

      {/* Модальные окна */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Выберите вход</h2>
            <Link to="/login?type=client" className="block bg-blue-500 text-white p-2 rounded mb-2">Вход для клиентов</Link>
            <Link to="/login?type=company" className="block bg-blue-700 text-white p-2 rounded">Вход для компаний</Link>
            <button className="mt-4 text-red-500" onClick={() => setShowLoginModal(false)}>Закрыть</button>
          </div>
        </div>
      )}

      {showRegisterModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Регистрация</h2>
            <Link to="/register" className="block bg-green-500 text-white p-2 rounded">Перейти к регистрации</Link>
            <button className="mt-4 text-red-500" onClick={() => setShowRegisterModal(false)}>Закрыть</button>
          </div>
        </div>
      )}
    </>
  );
}
