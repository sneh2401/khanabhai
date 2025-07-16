"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  /* ---------------------------------------------------------------- */
  /*  Dummy data – replace with your DB/API later                     */
  /* ---------------------------------------------------------------- */
  const [orders, setOrders] = useState([
    { id: "ORD-001", customerName: "John Doe",  items: ["Chicken Burger", "Fries", "Coke"],        total: 25.99, orderTime: "2025-01-16T10:30:00", status: "preparing", phone: "+1234567890" },
    { id: "ORD-002", customerName: "Alice Smith",items: ["Margherita Pizza", "Garlic Bread"],       total: 32.50, orderTime: "2025-01-16T11:15:00", status: "preparing", phone: "+1234567891" },
    { id: "ORD-003", customerName: "Bob Johnson", items: ["Fish & Chips", "Onion Rings"],          total: 18.75, orderTime: "2025-01-16T11:45:00", status: "ready",     phone: "+1234567892" },
    { id: "ORD-004", customerName: "Emma Wilson", items: ["Veggie Wrap", "Smoothie"],               total: 15.25, orderTime: "2025-01-16T12:00:00", status: "preparing", phone: "+1234567893" },
    { id: "ORD-005", customerName: "Mike Davis",  items: ["BBQ Burger", "Loaded Fries", "Milkshake"],total: 28.99, orderTime: "2025-01-16T12:20:00", status: "preparing", phone: "+1234567894" }
  ]);

  /* ---------------------------------------------------------------- */
  /*  Helpers                                                         */
  /* ---------------------------------------------------------------- */
  const activeOrders = orders.filter(o => o.status === "preparing" || o.status === "ready");
  const pendingOrders = orders.filter(o => o.status === "preparing").length;
  const readyOrders   = orders.filter(o => o.status === "ready").length;

  const handleStatusChange   = (id, status) => setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  const handleOrderDelivered = (id) => setOrders(orders.filter(o => o.id !== id));

  const getStatusColor = (s) =>
    s === "preparing"
      ? "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 border-amber-300"
      : s === "ready"
      ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 border-emerald-300"
      : "bg-gradient-to-r from-stone-50 to-neutral-50 text-stone-800 border-stone-300";

  const formatTime = (t) =>
    new Date(t).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

  /* ---------------------------------------------------------------- */
  /*  UI                                                              */
  /* ---------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">

      {/* ================= HEADER ================= */}
      <header className="bg-white/90 backdrop-blur-lg shadow-xl border-b border-amber-200/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">

              {/* Logo with warm colors */}
              <div className="w-12 h-12 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
              </div>

              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-stone-800 to-amber-800 bg-clip-text text-transparent">KhanaBuddy</h1>
                <p className="text-sm text-amber-700 font-medium">Admin Dashboard</p>
              </div>
            </div>

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
      </header>

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">

          {/* ---------- STAT CARDS with warm colors ---------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

            {/* Preparing - Warm orange theme */}
            <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-amber-200/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/8 to-orange-600/8 rounded-3xl" />
              <div className="relative flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-amber-900 mb-3">Preparing Orders</h3>
                  <p className="text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    {pendingOrders}
                  </p>
                  <p className="text-sm text-amber-700 font-medium">Orders being prepared</p>
                </div>

                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Ready - Warm teal theme */}
            <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-emerald-200/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-600/8 to-emerald-600/8 rounded-3xl" />
              <div className="relative flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-teal-900 mb-3">Ready Orders</h3>
                  <p className="text-4xl font-black bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                    {readyOrders}
                  </p>
                  <p className="text-sm text-teal-700 font-medium">Ready for delivery</p>
                </div>

                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* ---------- ACTIVE ORDERS TABLE ---------- */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-amber-200/50 overflow-hidden">
            <div className="px-8 py-6 border-b border-amber-200/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-amber-900">Active Orders</h3>
                <p className="text-sm text-amber-700 font-medium">Manage and track current orders in real-time</p>
              </div>

              {/* Updated Sales Button with unique styling */}
              <button
                onClick={() => router.push("/admin-dashboard/saleslist")}
                className="group relative overflow-hidden bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H19M7 13v4a2 2 0 002 2h2m8-2a2 2 0 11-4 0 2 2 0 014 0zM13 7a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <span className="relative">Sales Report</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200/50">
                    <th className="px-8 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">Order Details</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">Customer</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">Items</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">Total</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">Time</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>

                <tbody className="bg-white/60 divide-y divide-amber-200/50">
                  {activeOrders.map((order, i) => (
                    <tr key={order.id} className="hover:bg-white/90 transition-all duration-200">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {i + 1}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-amber-900">{order.id}</div>
                            <div className="text-xs text-amber-600 font-medium">{order.phone}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md">
                            {order.customerName[0]}
                          </div>
                          <div className="text-sm font-semibold text-amber-900">{order.customerName}</div>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex flex-wrap gap-2">
                          {order.items.map((item, idx) => (
                            <span key={idx} className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200/50 hover:from-amber-200 hover:to-orange-200 transition-all duration-200">
                              {item}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-lg font-bold text-amber-900">${order.total.toFixed(2)}</div>
                      </td>

                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm font-medium text-amber-800">{formatTime(order.orderTime)}</div>
                      </td>

                      <td className="px-8 py-6 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={e => handleStatusChange(order.id, e.target.value)}
                          className={`px-4 py-2 text-sm font-bold rounded-2xl border-2 focus:outline-none focus:ring-4 focus:ring-amber-500/20 cursor-pointer transition-all duration-200 ${getStatusColor(order.status)}`}
                        >
                          <option value="preparing">⏳ Preparing</option>
                          <option value="ready">✅ Ready</option>
                        </select>
                      </td>

                      <td className="px-8 py-6 whitespace-nowrap">
                        {order.status === "ready" ? (
                          <button
                            onClick={() => handleOrderDelivered(order.id)}
                            className="group bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-4 py-2 rounded-2xl font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                          >
                            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                            Mark Delivered
                          </button>
                        ) : (
                          <button disabled className="bg-gradient-to-r from-stone-400 to-neutral-500 text-white px-4 py-2 rounded-2xl font-semibold opacity-60 cursor-not-allowed flex items-center gap-2">
                            <svg className="w-4 h-4 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                            </svg>
                            In Progress
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
