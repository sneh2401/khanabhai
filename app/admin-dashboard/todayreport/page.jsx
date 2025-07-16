"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "../../_components/adminNavbar";

export default function TodayReport() {
  /* ---------------------------- local state ---------------------------- */
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState("");
  const [orders, setOrders]           = useState([]);      // sample orders

  /* ----------------------- helper: sample-data seed -------------------- */
  const generateSampleData = () => {
    const today       = new Date();
    const sampleItems = [
      ["Chicken Burger", "Fries", "Coke"],
      ["Margherita Pizza", "Garlic Bread"],
      ["Fish & Chips", "Onion Rings"],
      ["Veggie Wrap", "Smoothie"],
      ["BBQ Burger", "Loaded Fries", "Milkshake"],
      ["Caesar Salad", "Grilled Chicken"],
      ["Beef Steak", "Mashed Potatoes"],
      ["Sushi Roll", "Miso Soup"],
      ["Pasta Carbonara", "Garlic Bread"],
      ["Chicken Salad", "Iced Tea"],
    ];
    const customers = [
      "John Doe","Alice Smith","Bob Johnson","Emma Wilson","Mike Davis",
      "Sarah Connor","Tom Hardy","Jennifer Lopez","Robert Smith","Lisa Johnson",
      "David Wilson","Maria Garcia","James Brown","Anna Taylor","Chris Lee",
    ];

    const ordersArr = [];
    /* generate the past 15 days */
    for (let d = 14; d >= 0; d--) {
      const day      = new Date(today);
      day.setDate(today.getDate() - d);
      const nOrders  = Math.floor(Math.random() * 5) + 1;

      for (let i = 0; i < nOrders; i++) {
        const orderTime = new Date(day);
        orderTime.setHours(Math.floor(Math.random() * 12) + 9); // 9 AM – 8 PM
        orderTime.setMinutes(Math.floor(Math.random() * 60));

        ordersArr.push({
          id: `ORD-${String(ordersArr.length + 1).padStart(3, "0")}`,
          customerName: customers[Math.floor(Math.random() * customers.length)],
          items:        sampleItems[Math.floor(Math.random() * sampleItems.length)],
          total:        +(Math.random() * 40 + 15).toFixed(2), // ₹15-55
          orderTime:    orderTime.toISOString(),
          status:       "delivered",
          phone:        `+91${Math.floor(Math.random() * 9_000_000_000) + 1_000_000_000}`,
        });
      }
    }
    return ordersArr;
  };

  /* ------------------------ lifecycle – client only -------------------- */
  useEffect(() => {
    /* live clock (IST) */
    const tick = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleString("en-IN", {
          weekday: "long",
          year:    "numeric",
          month:   "long",
          day:     "numeric",
          hour:    "2-digit",
          minute:  "2-digit",
          second:  "2-digit",
          timeZone: "Asia/Kolkata",
        })
      );
    };
    tick();
    const tId = setInterval(tick, 1_000);
    return () => clearInterval(tId);
  }, []);

  /* sample-orders (client side to avoid hydration mismatch) */
  useEffect(() => {
    setOrders(generateSampleData());
  }, []);

  /* ------------------------------- derived ----------------------------- */
  const deliveredOrders = orders.filter(o => o.status === "delivered");

  const todayISO   = new Date().toISOString().split("T")[0];
  const todayOrders = deliveredOrders.filter(o => o.orderTime.split("T")[0] === todayISO);
  const todayCount  = todayOrders.length;
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);

  const fmtTime = iso =>
    new Date(iso).toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata",
    });
  const fmtDate = iso =>
    new Date(iso).toLocaleDateString("en-IN", {
      month: "short", day: "numeric", timeZone: "Asia/Kolkata",
    });

  /* --------------------------- print support --------------------------- */
  const handlePrint = () => {
    const css = `
    @media print {
      body *            { visibility: hidden; }
      .print-area, 
      .print-area *     { visibility: visible; }
      .print-area       { position: absolute; inset: 0; width: 100%; }
      .no-print         { display: none !important; }
      nav               { display: none !important; }
      @page             { margin: 1in; size: A4; }
    }`;
    const style = document.createElement("style");
    style.innerHTML = css;
    document.head.appendChild(style);
    window.print();
    setTimeout(() => document.head.removeChild(style), 1_000);
  };

  /* -------------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <AdminNavbar />

      {/* printable region */}
      <div className="print-area">
        <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
          {/* header */}
          <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-amber-200/50">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-stone-800 to-amber-800 bg-clip-text text-transparent">
                  Today&#39;s Report
                </h2>
                <p className="text-sm text-amber-700 font-medium mt-1">
                  {currentTime || "Loading…"}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrint}
                  className="no-print bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd"/>
                  </svg>
                  Print
                </button>

                <div className="text-right bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-4 border border-teal-200/50">
                  <div className="text-sm font-bold text-teal-900">Today&#39;s Revenue</div>
                  <div className="text-2xl font-black text-teal-600">₹{todayRevenue.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* orders */}
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-amber-200/50">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-orange-600/10 rounded-3xl" />
              <div className="relative flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-amber-900 mb-1">Today&#39;s Orders</h3>
                  <p className="text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    {todayCount}
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl flex items-center justify-center text-white shadow-lg">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* revenue */}
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-emerald-200/50">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-600/10 to-emerald-600/10 rounded-3xl" />
              <div className="relative flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-teal-900 mb-1">Today&#39;s Revenue</h3>
                  <p className="text-4xl font-black bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                    ₹{todayRevenue.toFixed(2)}
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-lg">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* delivered orders table */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-amber-200/50">
            <div className="px-8 py-6 border-b border-amber-200/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-amber-900">Delivered Orders</h3>
                <span className="text-sm text-amber-700 font-medium">
                  {todayCount} orders today
                </span>
              </div>
            </div>

            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200/50">
                  <th className="px-8 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">Order</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">Customer</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">Items</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">Total</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">Time</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white/60 divide-y divide-amber-200/50">
                {todayOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-8 py-12 text-center text-amber-600">
                      No orders delivered today
                    </td>
                  </tr>
                )}

                {todayOrders.map((o, idx) => (
                  <tr key={o.id} className="hover:bg-white/90 transition-all">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-amber-900">{o.id}</div>
                          <div className="text-xs text-amber-600 font-medium">{o.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md">
                          {o.customerName[0]}
                        </div>
                        <span className="text-sm font-semibold text-amber-900">
                          {o.customerName}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-2">
                        {o.items.map((it, i) => (
                          <span key={i} className="inline-flex px-3 py-1 rounded-xl text-xs font-medium bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200/50">
                            {it}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-lg font-bold text-amber-900">
                      ₹{o.total.toFixed(2)}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm font-medium text-amber-800">{fmtTime(o.orderTime)}</div>
                      <div className="text-xs text-amber-600 font-medium">{fmtDate(o.orderTime)}</div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className="inline-flex items-center px-4 py-2 text-sm font-bold rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 border-2 border-emerald-300">
                        ✅ Delivered
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
