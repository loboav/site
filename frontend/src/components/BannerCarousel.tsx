import { useState, useEffect } from "react";

const banners = [
  { id: 1, image: "/images/banner1.jpg", link: "/promo1" },
  { id: 2, image: "/images/banner2.jpg", link: "/promo2" },
  { id: 3, image: "/images/banner3.jpg", link: "/promo3" },
];

export default function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {banners.map((banner) => (
          <a key={banner.id} href={banner.link} className="w-full flex-shrink-0">
            <img src={banner.image} alt="banner" className="w-full h-64 object-cover" />
          </a>
        ))}
      </div>
    </div>
  );
}
