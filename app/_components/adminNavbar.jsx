"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminNavbar() {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, [router]);

  const navItems = [
    { 
      label: "Active Orders", 
      href: "/admin-dashboard",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd"/>
        </svg>
      )
    },
    { 
      label: "Inventory", 
      href: "/admin-dashboard/inventory",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
          <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd"/>
        </svg>
      )
    },
    { 
      label: "Sales Report", 
      href: "/admin-dashboard/saleslist",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
        </svg>
      )
    }
  ];

  const isActive = (href) => {
    if (href === "/admin-dashboard") {
      return currentPath === href || currentPath === "/admin-dashboard/";
    }
    return currentPath === href;
  };

  return (
    <header className="bg-white/90 backdrop-blur-lg shadow-xl border-b border-amber-200/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Row */}
        <div className="flex justify-between items-center h-20">
          {/* Logo + Title */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-stone-800 to-amber-800 bg-clip-text text-transparent">
                KhanaBuddy
              </h1>
              <p className="text-sm text-amber-700 font-medium">Admin Dashboard</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => router.push("/")}
            className="group bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-white border-t border-amber-200/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex space-x-8">
            {navItems.map(({ label, href, icon }) => (
              <li key={href} className="flex">
                <button
                  onClick={() => router.push(href)}
                  className={`flex items-center gap-2 py-4 px-2 text-sm font-medium border-b-2 transition-all duration-200 ${
                    isActive(href)
                      ? "border-amber-600 text-amber-800 bg-amber-50/50"
                      : "border-transparent text-amber-600 hover:text-amber-800 hover:border-amber-400 hover:bg-amber-50/30"
                  }`}
                >
                  {icon}
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
