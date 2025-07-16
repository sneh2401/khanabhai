"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SalesList() {
  const router = useRouter();
  
  // Extended data including delivered orders to show all statuses
  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      customerName: "John Doe",
      items: ["Chicken Burger", "Fries", "Coke"],
      total: 25.99,
      orderTime: "2025-01-16T10:30:00",
      status: "delivered",
      phone: "+1234567890"
    },
    {
      id: "ORD-002",
      customerName: "Alice Smith",
      items: ["Margherita Pizza", "Garlic Bread"],
      total: 32.50,
      orderTime: "2025-01-16T11:15:00",
      status: "preparing",
      phone: "+1234567891"
    },
    {
      id: "ORD-003",
      customerName: "Bob Johnson",
      items: ["Fish & Chips", "Onion Rings"],
      total: 18.75,
      orderTime: "2025-01-16T11:45:00",
      status: "ready",
      phone: "+1234567892"
    },
    {
      id: "ORD-004",
      customerName: "Emma Wilson",
      items: ["Veggie Wrap", "Smoothie"],
      total: 15.25,
      orderTime: "2025-01-16T12:00:00",
      status: "delivered",
      phone: "+1234567893"
    },
    {
      id: "ORD-005",
      customerName: "Mike Davis",
      items: ["BBQ Burger", "Loaded Fries", "Milkshake"],
      total: 28.99,
      orderTime: "2025-01-16T12:20:00",
      status: "preparing",
      phone: "+1234567894"
    },
    {
      id: "ORD-006",
      customerName: "Sarah Connor",
      items: ["Caesar Salad", "Grilled Chicken"],
      total: 22.50,
      orderTime: "2025-01-16T12:35:00",
      status: "delivered",
      phone: "+1234567895"
    },
    {
      id: "ORD-007",
      customerName: "Tom Hardy",
      items: ["Beef Steak", "Mashed Potatoes"],
      total: 45.00,
      orderTime: "2025-01-16T13:00:00",
      status: "ready",
      phone: "+1234567896"
    },
    {
      id: "ORD-008",
      customerName: "Jennifer Lopez",
      items: ["Sushi Roll", "Miso Soup"],
      total: 35.75,
      orderTime: "2025-01-16T13:20:00",
      status: "preparing",
      phone: "+1234567897"
    },
    {
      id: "ORD-009",
      customerName: "Robert Smith",
      items: ["Pasta Carbonara", "Garlic Bread"],
      total: 28.50,
      orderTime: "2025-01-16T14:00:00",
      status: "delivered",
      phone: "+1234567898"
    },
    {
      id: "ORD-010",
      customerName: "Lisa Johnson",
      items: ["Chicken Salad", "Iced Tea"],
      total: 16.99,
      orderTime: "2025-01-16T14:30:00",
      status: "delivered",
      phone: "+1234567899"
    }
  ]);

  // Calculate statistics for delivered orders only
  const deliveredOrders = orders.filter(order => order.status === "delivered");
  const totalCompletedOrders = deliveredOrders.length;
  const totalIncomeGenerated = deliveredOrders.reduce((sum, order) => sum + order.total, 0);

  const handleBackToDashboard = () => {
    router.push("/admin-dashboard");
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Enhanced Header with warm theme */}
      <header className="bg-white/90 backdrop-blur-lg shadow-xl border-b border-amber-200/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToDashboard}
                className="group p-3 hover:bg-amber-100/50 rounded-2xl transition-all duration-300 mr-2 hover:shadow-md"
                title="Back to Dashboard"
              >
                <svg className="w-6 h-6 text-amber-600 group-hover:text-amber-800 group-hover:-translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              
              <div className="w-12 h-12 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                </svg>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-stone-800 to-amber-800 bg-clip-text text-transparent">
                  Sales Report
                </h1>
                <p className="text-sm text-amber-700 font-medium">Daily sales report and completed orders</p>
              </div>
            </div>
            
            <div className="text-right bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-amber-200/50">
              <div className="text-sm font-bold text-amber-900">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-xs text-amber-700 font-medium mt-1">
                Revenue: <span className="font-bold text-teal-600">${totalIncomeGenerated.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Enhanced Statistics Cards with warm theme */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Total Completed Orders */}
            <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-amber-200/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/8 to-orange-600/8 rounded-3xl"></div>
              <div className="relative flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-amber-900 mb-3">Completed Orders</h3>
                  <p className="text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    {totalCompletedOrders}
                  </p>
                  <p className="text-sm text-amber-700 font-medium">Orders delivered today</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Income Generated */}
            <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-emerald-200/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-600/8 to-emerald-600/8 rounded-3xl"></div>
              <div className="relative flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-teal-900 mb-3">Total Income</h3>
                  <p className="text-4xl font-black bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                    ${totalIncomeGenerated.toFixed(2)}
                  </p>
                  <p className="text-sm text-teal-700 font-medium">Revenue generated today</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Delivered Orders Table */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-amber-200/50 overflow-hidden">
            <div className="px-8 py-6 border-b border-amber-200/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-amber-900">Delivered Orders</h3>
                <p className="text-sm text-amber-700 font-medium">All completed orders for today</p>
              </div>
            </div>
            
            <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200/50">
                      <th className="px-8 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">Order Details</th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">Customer</th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">Items</th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">Total</th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">Delivery Time</th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/60 divide-y divide-amber-200/50">
                    {deliveredOrders.map((order, index) => (
                      <tr key={order.id} className="hover:bg-white/90 transition-all duration-200">
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md">
                              {index + 1}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-amber-900">{order.id}</div>
                              <div className="text-xs text-amber-600 font-medium">{order.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md">
                              {order.customerName.charAt(0)}
                            </div>
                            <div className="text-sm font-semibold text-amber-900">{order.customerName}</div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-wrap gap-2">
                            {order.items.map((item, itemIndex) => (
                              <span key={itemIndex} className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200/50 hover:from-amber-200 hover:to-orange-200 transition-all duration-200">
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
                          <div className="text-xs text-amber-600 font-medium">{formatDate(order.orderTime)}</div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span className="inline-flex items-center px-4 py-2 text-sm font-bold rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 border-2 border-emerald-300">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                            ✅ Delivered
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
