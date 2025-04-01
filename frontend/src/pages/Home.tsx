import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="text-center p-5 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-red-500">Добро пожаловать в My Honey Shop! 🍯</h1>
      <p className="text-lg">Выберите действие:</p>
      <nav className="mt-4">
        <Link to="/login" className="mr-4 text-white bg-red-500 px-4 py-2 rounded">Вход</Link>
        <Link to="/register" className="text-white bg-blue-500 px-4 py-2 rounded">Регистрация</Link>
      </nav>
      <div className="mt-10 w-full max-w-screen-md text-left">
        <p className="text-gray-700 text-lg mb-4">Наш магазин предлагает только лучший мёд, варенье и подарки для ваших близких. Ознакомьтесь с нашим ассортиментом и выберите идеальный продукт!</p>
        <p className="text-gray-700 text-lg mb-4">Мы работаем напрямую с пасечниками, поэтому гарантируем высокое качество и натуральность нашей продукции.</p>
        <p className="text-gray-700 text-lg mb-4">Сделайте заказ сегодня и получите приятные бонусы!</p>
      </div>
      <div className="h-96"></div> {/* Добавленный отступ для увеличения высоты страницы */}
    </div>
  );
}
