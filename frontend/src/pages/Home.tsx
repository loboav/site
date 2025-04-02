import BannerCarousel from "../components/BannerCarousel";
import ProductList from "../components/ProductList";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      {/* Карусель с баннерами */}
      <BannerCarousel />

      {/* Список товаров */}
      <h2 className="text-2xl font-bold mt-8 mb-4">Наш ассортимент</h2>
      <ProductList />
    </div>
  );
}
