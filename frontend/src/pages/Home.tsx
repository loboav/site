import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Добро пожаловать в My Honey Shop! 🍯</h1>
      <p>Выберите действие:</p>
      <nav>
        <Link to="/login" style={{ marginRight: "15px" }}>Вход</Link>
        <Link to="/register">Регистрация</Link>
      </nav>
    </div>
  );
}
