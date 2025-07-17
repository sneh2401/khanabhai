"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "../_components/adminNavbar";
import { saveDeliveredOrder, saveActiveOrders, getActiveOrders, formatCurrency } from "../utils/localStorage";
import { reduceInventoryQuantity, checkItemAvailability, calculateOrderTotal, getCurrentInventoryStatus } from "../utils/inventoryUtils";

export default function AdminDashboard() {
  const router = useRouter();

  // Enhanced initial orders with strategic overlapping items for meaningful analytics
  const initialOrders = [
    { id: "ORD-001", customerName: "John Doe", items: ["Chicken Burger", "Fries", "Coke"], orderTime: "2025-01-17T10:30:00", status: "preparing", phone: "+1234567890" },
    { id: "ORD-002", customerName: "Alice Smith", items: ["Chicken Burger", "Coke"], orderTime: "2025-01-17T11:15:00", status: "preparing", phone: "+1234567891" },
    { id: "ORD-003", customerName: "Bob Johnson", items: ["Chicken Burger", "Onion Rings"], orderTime: "2025-01-17T11:45:00", status: "ready", phone: "+1234567892" },
    { id: "ORD-004", customerName: "Emma Wilson", items: ["Chicken Burger", "Fries"], orderTime: "2025-01-17T12:00:00", status: "preparing", phone: "+1234567893" },
    { id: "ORD-005", customerName: "Mike Davis", items: ["BBQ Burger", "Chicken Burger", "Coke"], orderTime: "2025-01-17T12:20:00", status: "preparing", phone: "+1234567894" },
    { id: "ORD-006", customerName: "Sarah Connor", items: ["Chicken Burger", "Fries", "Milkshake"], orderTime: "2025-01-17T12:30:00", status: "ready", phone: "+1234567895" },
    { id: "ORD-007", customerName: "David Lee", items: ["Margherita Pizza", "Chicken Burger"], orderTime: "2025-01-17T12:45:00", status: "preparing", phone: "+1234567896" },
    { id: "ORD-008", customerName: "Lisa Park", items: ["Chicken Burger", "Onion Rings", "Smoothie"], orderTime: "2025-01-17T13:00:00", status: "ready", phone: "+1234567897" },
    { id: "ORD-009", customerName: "Tom Wilson", items: ["Chicken Burger", "Garlic Bread"], orderTime: "2025-01-17T13:15:00", status: "preparing", phone: "+1234567898" },
    { id: "ORD-010", customerName: "Maria Garcia", items: ["Fries", "Coke", "Chicken Burger"], orderTime: "2025-01-17T13:30:00", status: "ready", phone: "+1234567899" },
    { id: "ORD-011", customerName: "James Brown", items: ["Margherita Pizza", "Fries", "Coke"], orderTime: "2025-01-17T13:45:00", status: "preparing", phone: "+1234567900" },
    { id: "ORD-012", customerName: "Sophie Taylor", items: ["Chicken Burger", "Loaded Fries"], orderTime: "2025-01-17T14:00:00", status: "ready", phone: "+1234567901" },
    { id: "ORD-013", customerName: "Kevin Martinez", items: ["Chicken Burger", "Coke", "Garlic Bread"], orderTime: "2025-01-17T14:15:00", status: "preparing", phone: "+1234567902" },
    { id: "ORD-014", customerName: "Rachel Green", items: ["Chicken Burger", "Fries", "Smoothie"], orderTime: "2025-01-17T14:30:00", status: "ready", phone: "+1234567903" },
    { id: "ORD-015", customerName: "Chris Evans", items: ["BBQ Burger", "Fries"], orderTime: "2025-01-17T14:45:00", status: "preparing", phone: "+1234567904" }
  ];

  const [orders, setOrders] = useState([]);
  const [inventoryAlert, setInventoryAlert] = useState("");
  const [animatingItems, setAnimatingItems] = useState(new Set());
  const [flashingItems, setFlashingItems] = useState(new Set());
  const [syncStatus, setSyncStatus] = useState('connected');
  const [inventoryStatus, setInventoryStatus] = useState({});
  const animationTimeouts = useRef({});

  // ✅ Enhanced: Calculate dynamic totals for orders
  const calculateOrdersWithDynamicTotals = (ordersList) => {
    return ordersList.map(order => {
      const { total, itemDetails } = calculateOrderTotal(order.items);
      return {
        ...order,
        total,
        itemDetails
      };
    });
  };

  // Load orders from localStorage on component mount
  useEffect(() => {
    const savedOrders = getActiveOrders();
    if (savedOrders.length > 0) {
      setOrders(calculateOrdersWithDynamicTotals(savedOrders));
    } else {
      setOrders(calculateOrdersWithDynamicTotals(initialOrders));
      saveActiveOrders(initialOrders);
    }
  }, []);

  // ✅ Enhanced: Real-time inventory status tracking
  useEffect(() => {
    const updateInventoryStatus = () => {
      try {
        const status = getCurrentInventoryStatus();
        setInventoryStatus(status);
        setSyncStatus('connected');
      } catch (error) {
        console.error('Failed to get inventory status:', error);
        setSyncStatus('disconnected');
      }
    };

    // Update inventory status immediately
    updateInventoryStatus();

    // Listen for inventory changes
    const handleInventoryChange = () => {
      updateInventoryStatus();
    };

    window.addEventListener('inventoryUpdated', handleInventoryChange);
    window.addEventListener('pricesUpdated', handleInventoryChange);
    window.addEventListener('quantityUpdated', handleInventoryChange);

    return () => {
      window.removeEventListener('inventoryUpdated', handleInventoryChange);
      window.removeEventListener('pricesUpdated', handleInventoryChange);
      window.removeEventListener('quantityUpdated', handleInventoryChange);
    };
  }, []);

  // ✅ Enhanced: Comprehensive inventory/price updates with immediate synchronization
  useEffect(() => {
    const handleInventoryUpdate = (event) => {
      console.log('Inventory update received:', event.detail);
      const { newlyAvailableItems, updatedItems, removedItems } = event.detail || {};
      
      // Immediately recalculate totals when inventory changes
      setOrders(currentOrders => {
        const updatedOrders = calculateOrdersWithDynamicTotals(currentOrders);
        console.log('Orders recalculated with new inventory:', updatedOrders);
        return updatedOrders;
      });
      
      // Handle newly available items with enhanced animations
      if (newlyAvailableItems && newlyAvailableItems.length > 0) {
        newlyAvailableItems.forEach(item => {
          const itemName = item.name.toLowerCase();
          
          // Add to flashing items for animation
          setFlashingItems(prev => new Set([...prev, itemName]));
          
          // Show success alert with more details
          const alertMessage = item.isNewItem 
            ? `🎉 New item "${item.name}" added to inventory! Price: ${formatCurrency(item.price)}`
            : `🔄 "${item.name}" is now back in stock! (${item.quantity} units at ${formatCurrency(item.price)} each)`;
          
          setInventoryAlert(alertMessage);
          
          // Clear flash animation after 3 seconds
          if (animationTimeouts.current[itemName]) {
            clearTimeout(animationTimeouts.current[itemName]);
          }
          
          animationTimeouts.current[itemName] = setTimeout(() => {
            setFlashingItems(prev => {
              const newSet = new Set(prev);
              newSet.delete(itemName);
              return newSet;
            });
          }, 3000);
        });
        
        // Clear alert after 5 seconds
        setTimeout(() => setInventoryAlert(""), 5000);
      } 
      
      // Handle removed items
      else if (removedItems && removedItems.length > 0) {
        setInventoryAlert(`⚠️ Items removed from inventory: ${removedItems.join(', ')}`);
        setTimeout(() => setInventoryAlert(""), 4000);
      }
      
      // Regular inventory update
      else {
        setInventoryAlert("📦 Inventory updated - Order totals refreshed!");
        setTimeout(() => setInventoryAlert(""), 3000);
      }
    };

    const handlePriceUpdate = (event) => {
      console.log('Price update received:', event.detail);
      const { updatedItems } = event.detail || {};
      
      // Immediately recalculate all order totals when prices change
      setOrders(currentOrders => {
        const updatedOrders = calculateOrdersWithDynamicTotals(currentOrders);
        console.log('Orders recalculated with new prices:', updatedOrders);
        return updatedOrders;
      });
      
      if (updatedItems && updatedItems.length > 0) {
        const itemNames = updatedItems.map(item => item.name).join(', ');
        setInventoryAlert(`💰 Prices updated for: ${itemNames} - Order totals refreshed!`);
      } else {
        setInventoryAlert("💰 Inventory prices updated - Order totals refreshed!");
      }
      
      setTimeout(() => setInventoryAlert(""), 3000);
    };

    // ✅ New: Add quantity update handler
    const handleQuantityUpdate = (event) => {
      console.log('Quantity update received:', event.detail);
      const { updatedItems } = event.detail || {};
      
      // Immediately recalculate order availability
      setOrders(currentOrders => calculateOrdersWithDynamicTotals(currentOrders));
      
      if (updatedItems) {
        const lowStockItems = updatedItems.filter(item => item.quantity < 5);
        if (lowStockItems.length > 0) {
          setInventoryAlert(`⚠️ Low stock alert: ${lowStockItems.map(item => `${item.name} (${item.quantity} left)`).join(', ')}`);
          setTimeout(() => setInventoryAlert(""), 5000);
        }
      }
    };

    // ✅ Enhanced: Listen to multiple event types for comprehensive updates
    window.addEventListener('inventoryUpdated', handleInventoryUpdate);
    window.addEventListener('pricesUpdated', handlePriceUpdate);
    window.addEventListener('quantityUpdated', handleQuantityUpdate);
    window.addEventListener('inventoryItemAdded', handleInventoryUpdate);
    window.addEventListener('inventoryItemRemoved', handleInventoryUpdate);

    return () => {
      window.removeEventListener('inventoryUpdated', handleInventoryUpdate);
      window.removeEventListener('pricesUpdated', handlePriceUpdate);
      window.removeEventListener('quantityUpdated', handleQuantityUpdate);
      window.removeEventListener('inventoryItemAdded', handleInventoryUpdate);
      window.removeEventListener('inventoryItemRemoved', handleInventoryUpdate);
      
      // Clear all animation timeouts
      Object.values(animationTimeouts.current).forEach(clearTimeout);
    };
  }, []);

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    if (orders.length > 0) {
      // Save orders without itemDetails to avoid localStorage bloat
      const ordersToSave = orders.map(({ itemDetails, ...order }) => order);
      saveActiveOrders(ordersToSave);
    }
  }, [orders]);

  // Helper functions
  const activeOrders = orders.filter(o => o.status === "preparing" || o.status === "ready");
  const pendingOrders = orders.filter(o => o.status === "preparing").length;
  const readyOrders = orders.filter(o => o.status === "ready").length;

  const handleStatusChange = (id, status) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  // Enhanced handleOrderDelivered with inventory integration
  const handleOrderDelivered = (id) => {
    const orderToDeliver = orders.find(o => o.id === id);
    if (orderToDeliver) {
      // Check if items are available before delivering
      const unavailableItems = checkItemAvailability(orderToDeliver.items);
      
      if (unavailableItems.length > 0) {
        setInventoryAlert(`⚠️ Cannot deliver order ${id}: ${unavailableItems.join(', ')} are not available in inventory.`);
        setTimeout(() => setInventoryAlert(""), 5000);
        return;
      }

      // Reduce inventory quantities
      const inventoryUpdated = reduceInventoryQuantity(orderToDeliver.items);
      
      // Mark order as delivered with current timestamp
      const orderWithDeliveryTime = {
        ...orderToDeliver,
        deliveredAt: new Date().toISOString(),
        deliveredTime: new Date().toISOString(),
        status: 'delivered'
      };
      
      const success = saveDeliveredOrder(orderWithDeliveryTime);
      if (success) {
        setOrders(orders.filter(o => o.id !== id));
        
        if (inventoryUpdated) {
          setInventoryAlert(`✅ Order ${id} delivered successfully! Inventory updated.`);
          console.log(`Order ${id} delivered. Inventory updated.`);
        } else {
          setInventoryAlert(`✅ Order ${id} delivered successfully!`);
          console.log(`Order ${id} delivered but inventory was not updated.`);
        }
        
        setTimeout(() => setInventoryAlert(""), 3000);
      } else {
        setInventoryAlert(`❌ Failed to save delivered order ${id}`);
        setTimeout(() => setInventoryAlert(""), 5000);
      }
    }
  };

  // Helper functions for styling
  const getStatusColor = (s) =>
    s === "preparing"
      ? "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 border-amber-300"
      : s === "ready"
      ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 border-emerald-300"
      : "bg-gradient-to-r from-stone-50 to-neutral-50 text-stone-800 border-stone-300";

  const formatTime = (t) =>
    new Date(t).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

  // ✅ Enhanced: Render items with better real-time feedback
  const renderOrderItems = (order) => {
    const { itemDetails } = calculateOrderTotal(order.items);
    
    return (
      <div className="flex flex-wrap gap-2">
        {itemDetails.map((item, idx) => {
          const itemKey = `${order.id}-${item.name}-${idx}`;
          const isFlashing = flashingItems.has(item.name.toLowerCase());
          const isLowStock = item.quantity < 5 && !item.isOutOfStock;
          
          return (
            <span 
              key={itemKey}
              className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium border transition-all duration-300 ${
                item.isOutOfStock 
                  ? "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300 animate-pulse" 
                  : isLowStock
                  ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 border-orange-200/50"
                  : "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200/50 hover:from-amber-200 hover:to-orange-200"
              } ${
                isFlashing 
                  ? "animate-pulse bg-gradient-to-r from-green-200 to-emerald-200 text-green-800 border-green-400 shadow-lg transform scale-105" 
                  : ""
              }`}
              style={{
                animation: isFlashing ? 'flash 0.5s ease-in-out infinite alternate' : 'none'
              }}
              title={`${item.name} - ${formatCurrency(item.price)} each${item.isOutOfStock ? ' (OUT OF STOCK)' : isLowStock ? ' (LOW STOCK)' : ''}`}
            >
              {item.quantity}x {item.name}
              {item.isOutOfStock && <span className="ml-1">⚠️</span>}
              {isLowStock && !item.isOutOfStock && <span className="ml-1">⚡</span>}
              {isFlashing && <span className="ml-1">✨</span>}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <AdminNavbar />

      {/* ✅ Enhanced: CSS animations with additional effects */}
      <style jsx>{`
        @keyframes flash {
          0% { background-color: rgba(34, 197, 94, 0.2); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
          50% { background-color: rgba(34, 197, 94, 0.4); box-shadow: 0 0 0 8px rgba(34, 197, 94, 0.1); }
          100% { background-color: rgba(34, 197, 94, 0.2); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
        }
        
        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes priceUpdate {
          0% { background-color: rgba(59, 130, 246, 0.1); }
          50% { background-color: rgba(59, 130, 246, 0.3); }
          100% { background-color: rgba(59, 130, 246, 0.1); }
        }
        
        @keyframes stockAlert {
          0% { background-color: rgba(245, 158, 11, 0.1); }
          50% { background-color: rgba(245, 158, 11, 0.3); }
          100% { background-color: rgba(245, 158, 11, 0.1); }
        }
        
        .flash-alert {
          animation: slideIn 0.3s ease-out;
        }
        
        .price-updated {
          animation: priceUpdate 1s ease-in-out;
        }
        
        .stock-alert {
          animation: stockAlert 1s ease-in-out;
        }
      `}</style>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">

          {/* ✅ Enhanced: Inventory Alert with better animation */}
          {inventoryAlert && (
            <div className="mb-6 p-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200 flash-alert">
              <div className="flex items-center gap-3">
                <div className="text-lg">{inventoryAlert}</div>
                <button 
                  onClick={() => setInventoryAlert("")}
                  className="ml-auto text-amber-600 hover:text-amber-800 transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* ✅ Enhanced: Navigation Header with sync status */}
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <div className={`text-sm font-medium bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 border ${
                syncStatus === 'connected' 
                  ? 'text-green-700 border-green-200/50' 
                  : 'text-red-700 border-red-200/50'
              }`}>
                {syncStatus === 'connected' ? '⚡ Real-time Sync' : '⚠️ Sync Disconnected'}
              </div>
              <div className="text-sm text-amber-700 font-medium bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 border border-amber-200/50">
                💰 Dynamic Pricing Active
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Preparing Orders */}
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

            {/* Ready Orders */}
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
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Active Orders Table */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-amber-200/50 overflow-hidden">
            <div className="px-8 py-6 border-b border-amber-200/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50">
              <div>
                <h3 className="text-2xl font-bold text-amber-900">Active Orders</h3>
                <p className="text-sm text-amber-700 font-medium">Manage and track current orders in real-time • Dynamic pricing enabled</p>
              </div>
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
                    <th className="px-8 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">Actions</th>
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

                      {/* ✅ Enhanced: Items column with better animations */}
                      <td className="px-8 py-6">
                        {renderOrderItems(order)}
                      </td>

                      {/* ✅ Enhanced: Dynamic total with smooth transitions */}
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm font-bold text-amber-900 transition-all duration-300 price-updated">
                          {formatCurrency(order.total)}
                        </div>
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
