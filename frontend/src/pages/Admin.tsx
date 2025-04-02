import { useState } from "react";

export default function Admin() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const product = { name, description, price: parseFloat(price), imageUrl };

    const res = await fetch("http://localhost:3000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (res.ok) {
      alert("Товар добавлен!");
      setName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
    } else {
      alert("Ошибка при добавлении товара");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Добавить товар</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border"
          type="text"
          placeholder="Название"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          className="w-full p-2 border"
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border"
          type="number"
          placeholder="Цена"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border"
          type="text"
          placeholder="Ссылка на изображение"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />
        <button className="p-2 bg-yellow-500 text-white" type="submit">
          Добавить
        </button>
      </form>
    </div>
  );
}
