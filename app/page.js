"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Unsplash direct CDN images – no need to download!
const bgImages = [
  "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&w=1200&q=80",
  "https://images.pexels.com/photos/2232/vegetables-italian-pizza-restaurant.jpg?auto=compress&w=1200&q=80",
  "https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg",
  "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&w=1200&q=80",
];

// Hardcoded menu items
const menuItems = [
  { name: "Fries", price: 59, emoji: "🍟" },
  { name: "Garlic Bread", price: 99, emoji: "🥖" },
  { name: "Pasta", price: 149, emoji: "🍝" },
  { name: "Salad", price: 89, emoji: "🥗" },
  { name: "Burger", price: 129, emoji: "🍔" },
];

export default function LandingPage() {
  const [idx, setIdx] = useState(0);
  const router = useRouter();

  // Automatic background slide every 4 seconds
  useEffect(() => {
    const intv = setInterval(
      () => setIdx((i) => (i + 1) % bgImages.length),
      4000
    );
    return () => clearInterval(intv);
  }, []);

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0 -z-10">
        {bgImages.map((src, i) => (
          <img
            key={src}
            alt=""
            src={src}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-900 ease-in-out ${
              i === idx ? "opacity-100" : "opacity-0"
            }`}
            style={{ transition: "opacity 0.9s cubic-bezier(.4,0,.2,1)" }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/40 pointer-events-none" />
      </div>

      {/* Admin Button */}
      <button
        onClick={() => router.push("/admin-login")}
        className="fixed top-5 right-7 bg-white/80 text-black text-sm font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-white/90 z-20"
      >
        Admin
      </button>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-[2.5rem] md:text-5xl font-bold shadow-lg mb-3 text-white tracking-tight drop-shadow-xl">
            KhanaBuddy
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-medium shadow text-center max-w-lg">
            Order by Voice, Dine with Joy - Fast & Easy! <br />
          </p>
        </div>

        {/* Transparent Menu Table Section */}
        <div className="w-full max-w-2xl mx-auto mb-8">
          <div className="bg-white/20 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 p-6 md:p-8">
            {/* Menu Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                🍽️ Our Menu
              </h2>
              <p className="text-white/80 drop-shadow-md">
                Fresh ingredients, great taste, always affordable
              </p>
            </div>

            {/* Simplified Menu Table - Only Item & Price */}
            <div className="overflow-hidden rounded-2xl border border-white/20">
              <table className="w-full">
                {/* Table Header */}
                <thead className="bg-white/10 backdrop-blur-sm">
                  <tr>
                    <th className="px-4 md:px-6 py-4 text-left text-sm md:text-base font-bold text-white uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-4 md:px-6 py-4 text-right text-sm md:text-base font-bold text-white uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-white/10">
                  {menuItems.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-white/10 transition-colors duration-200"
                    >
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-xl md:text-2xl mr-3">
                            {item.emoji}
                          </span>
                          <div className="text-base md:text-lg font-semibold text-white drop-shadow-md">
                            {item.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right">
                        <div className="text-lg md:text-xl font-bold text-yellow-300 drop-shadow-md">
                          ₹{item.price}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Simplified Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="text-lg md:text-xl font-bold text-white">5</div>
                <div className="text-xs md:text-sm text-white/80">Items</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="text-lg md:text-xl font-bold text-yellow-300">
                  ₹59
                </div>
                <div className="text-xs md:text-sm text-white/80">From</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="text-lg md:text-xl font-bold text-green-300">
                  Fresh
                </div>
                <div className="text-xs md:text-sm text-white/80">Always</div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Button */}
        <button
          type="button"
          onClick={() => router.push("/order")}
          className="shadow-2xl w-[95vw] max-w-[26rem] py-4 text-xl font-bold rounded-xl bg-gradient-to-r from-teal-500 via-indigo-500 to-pink-500 text-white hover:scale-105 transition-all"
        >
          🛒 Order Now
        </button>
      </div>
    </div>
  );
}
