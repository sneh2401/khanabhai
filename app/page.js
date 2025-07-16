"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Unsplash direct CDN images – no need to download!
const bgImages = [
  "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fitPizza",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&w=1200&q=80",
  "https://images.pexels.com/photos/2232/vegetables-italian-pizza-restaurant.jpg?auto=compress&w=1200&q=80",
  "https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg",
  "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&w=1200&q=80",
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

  // Animation classes for gentle fade/slide
  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-between">
      {/* Bg Images */}
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
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none" />
      </div>

      {/* Admin Button */}
      <button
        onClick={() => router.push("/admin-login")}
        className="fixed top-5 right-7 bg-white/80 text-black text-sm font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-white/90 z-20"
      >
        Admin
      </button>

      {/* Center Content */}
      <div className="flex flex-col items-center mt-28">
        <h1 className="text-[2.5rem] md:text-5xl font-bold shadow-lg mb-3 text-white tracking-tight text-center drop-shadow-xl">
          KhanaBuddy
        </h1>
        <p className="text-lg md:text-xl text-white/90 font-medium shadow text-center max-w-lg">
          AI-powered food ordering. <br />
          Burgers, fries, meals & more, always fresh!
        </p>
      </div>

      {/* Footer Button */}
      <footer className="fixed bottom-0 left-0 right-0 flex justify-center z-20 pointer-events-none">
        <button
          type="button"
          onClick={() => router.push("/order")}
          className="pointer-events-auto shadow-xl w-[95vw] max-w-[26rem] my-4 py-4 text-xl font-bold rounded-xl bg-gradient-to-r from-teal-500 via-indigo-500 to-pink-500 text-white hover:scale-105 transition-all"
        >
          Order Now
        </button>
      </footer>
    </div>
  );
}
