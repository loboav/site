import { useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  // Состояние для управления отображением модальных окон
  const [showContactModal, setShowContactModal] = useState(false);
  
  return (
    <>
      {/* Основной контейнер подвала */}
      <footer className="bg-gray-900 text-white py-6 px-4 mt-10">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between">
          {/* Секция "О нас" */}
          <div>
            <h3 className="text-lg font-semibold">О нас</h3>
            <ul className="mt-2 text-sm space-y-1">
              <li><Link to="/about" className="hover:underline">О компании</Link></li>
              <li><Link to="/how-we-work" className="hover:underline">Как мы работаем</Link></li>
            </ul>
          </div>
          {/* Секция "Продукция" */}
          <div>
            <h3 className="text-lg font-semibold">Продукция</h3>
            <ul className="mt-2 text-sm space-y-1">
              <li><Link to="/honey-types" className="hover:underline">Виды мёда</Link></li>
              <li><Link to="/certificates" className="hover:underline">Сертификаты</Link></li>
            </ul>
          </div>
          {/* Секция "Контакты" */}
          <div>
            <h3 className="text-lg font-semibold">Контакты</h3>
            <button 
              className="mt-2 text-sm bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => setShowContactModal(true)}
            >
              Показать контакты
            </button>
          </div>
        </div>
        {/* Нижняя строка с копирайтом */}
        <div className="text-center text-sm text-gray-400 mt-4">
          © {new Date().getFullYear()} HoneyShop. Все права защищены.
        </div>
      </footer>
      
      {/* Модальное окно с контактами */}
      {showContactModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-black">
            <h2 className="text-xl font-bold mb-4">Контактная информация</h2>
            <p>Email: lobovp@yandex.ru</p>
            <p>Телефон: +375 29 686-09-61</p>7
            <button 
              className="mt-4 text-red-500" 
              onClick={() => setShowContactModal(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
}
