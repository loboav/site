import { useState, useEffect } from "react";
import axios from "axios";
import AdminPanel from "./AdminPanel";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) {
      console.log("Найденная роль в localStorage:", savedRole);
      setRole(savedRole);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      console.log("Ответ от сервера:", response.data);

      const { token, role } = response.data;

      if (!token || !role) {
        throw new Error("Неверный ответ от сервера");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      setRole(role);

      // Перенаправляем пользователя на страницу корзины
      navigate("/cart");
    } catch (err: any) {
      console.error("Ошибка входа:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Ошибка входа: неверные данные");
    } finally {
      setIsLoading(false);
    }
  };

  // Если админ, рендерим панель
  if (role === "admin") {
    return <AdminPanel />;
  }

  // Если обычный юзер, рендерим его личный кабинет
  if (role === "user") {
    return <UserDashboard />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Вход</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Введите email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}

function UserDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Добро пожаловать!</h2>
        <p>Вы вошли как обычный пользователь.</p>
        <button
          className="mt-4 bg-red-500 text-white p-2 rounded"
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
        >
          Выйти
        </button>
      </div>
    </div>
  );
}
