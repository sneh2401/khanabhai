// ✅ Enhanced: Comprehensive item name mapping between admin dashboard and inventory
const ITEM_MAPPING = {
  "Chicken Burger": "burger",
  "BBQ Burger": "burger", 
  "Margherita Pizza": "pizza",
  "Fries": "fries",
  "Loaded Fries": "fries",
  "Onion Rings": "fries",
  "Garlic Bread": "garlic bread",
  "Coke": "beverage",
  "Smoothie": "beverage",
  "Milkshake": "beverage",
  "Veggie Wrap": "wrap",
  "Fish & Chips": "fries"
};

// ✅ Enhanced: Reverse mapping for better compatibility
const REVERSE_ITEM_MAPPING = {
  "burger": "Chicken Burger",
  "pizza": "Margherita Pizza",
  "fries": "Fries",
  "garlic bread": "Garlic Bread",
  "beverage": "Coke",
  "wrap": "Veggie Wrap"
};

// ✅ Enhanced: Get inventory items with error handling
export const getInventoryItems = () => {
  try {
    const stored = localStorage.getItem('menu');
    if (stored) {
      const items = JSON.parse(stored);
      // Ensure all items have required properties
      return items.map(item => ({
        ...item,
        quantity: item.quantity ?? 0,
        price: item.price ?? 0,
        min_stock: item.min_stock ?? 5
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading inventory items:', error);
    return [];
  }
};

// ✅ Enhanced: Get display name for dashboard compatibility
export const getDisplayName = (itemName) => {
  const nameMap = {
    'pizza': 'Margherita Pizza',
    'burger': 'Chicken Burger', 
    'fries': 'Fries',
    'garlic bread': 'Garlic Bread',
    'pasta': 'Pasta',
    'beverage': 'Coke',
    'wrap': 'Veggie Wrap',
    'chicken burger': 'Chicken Burger',
    'bbq burger': 'BBQ Burger',
    'onion rings': 'Onion Rings',
    'loaded fries': 'Loaded Fries',
    'milkshake': 'Milkshake',
    'smoothie': 'Smoothie',
    'coke': 'Coke',
    'margherita pizza': 'Margherita Pizza',
    'fish & chips': 'Fish & Chips'
  };
  return nameMap[itemName.toLowerCase()] || itemName;
};

// ✅ New: Get current inventory status for dashboard (FIXES THE ERROR)
export const getCurrentInventoryStatus = () => {
  try {
    const menuItems = getInventoryItems();
    
    const getItemStatus = (quantity, minStock = 5) => {
      if (quantity === 0) return "Not Available";
      if (quantity < minStock) return "Need to Restock";
      return "Available";
    };

    return menuItems.reduce((status, item) => {
      const displayName = getDisplayName(item.item_name);
      status[displayName] = {
        quantity: item.quantity || 0,
        price: item.price || 0,
        min_stock: item.min_stock || 5,
        status: getItemStatus(item.quantity, item.min_stock),
        isOutOfStock: item.quantity === 0,
        isLowStock: item.quantity < (item.min_stock || 5) && item.quantity > 0
      };
      return status;
    }, {});
  } catch (error) {
    console.error('Error getting inventory status:', error);
    return {};
  }
};

// ✅ Enhanced: Save inventory items with comprehensive event tracking
export const saveInventoryItems = (items, changeDetails = null) => {
  try {
    const previousItems = getInventoryItems();
    localStorage.setItem('menu', JSON.stringify(items));
    
    // ✅ Enhanced: Detect all types of changes
    const newlyAvailableItems = [];
    const updatedItems = [];
    const removedItems = [];
    
    // Check for new and updated items
    items.forEach(currentItem => {
      const previousItem = previousItems.find(prev => prev.item_id === currentItem.item_id);
      const displayName = getDisplayName(currentItem.item_name);
      
      if (previousItem) {
        // Item was updated
        const wasOutOfStock = previousItem.quantity === 0;
        const isNowInStock = currentItem.quantity > 0;
        const quantityChanged = previousItem.quantity !== currentItem.quantity;
        const priceChanged = previousItem.price !== currentItem.price;
        
        if (wasOutOfStock && isNowInStock) {
          // Item became available again!
          newlyAvailableItems.push({
            name: displayName,
            quantity: currentItem.quantity,
            price: currentItem.price,
            previousQuantity: previousItem.quantity
          });
        }
        
        if (quantityChanged || priceChanged) {
          // Item was updated (quantity or price changed)
          updatedItems.push({
            name: displayName,
            quantity: currentItem.quantity,
            price: currentItem.price,
            previousQuantity: previousItem.quantity,
            previousPrice: previousItem.price,
            quantityChanged,
            priceChanged
          });
        }
      } else {
        // New item added
        newlyAvailableItems.push({
          name: displayName,
          quantity: currentItem.quantity,
          price: currentItem.price,
          isNewItem: true
        });
      }
    });
    
    // Check for removed items
    previousItems.forEach(previousItem => {
      const stillExists = items.find(item => item.item_id === previousItem.item_id);
      if (!stillExists) {
        removedItems.push(getDisplayName(previousItem.item_name));
      }
    });
    
    // ✅ Enhanced: Dispatch comprehensive events
    const eventDetail = {
      newlyAvailableItems,
      updatedItems,
      removedItems,
      allItems: items.map(item => ({
        ...item,
        displayName: getDisplayName(item.item_name)
      })),
      changeType: changeDetails?.type || 'update',
      changedItem: changeDetails?.changedItem ? {
        ...changeDetails.changedItem,
        displayName: getDisplayName(changeDetails.changedItem.item_name)
      } : null
    };
    
    // Main inventory updated event
    window.dispatchEvent(new CustomEvent('inventoryUpdated', { detail: eventDetail }));
    
    // Price update event
    if (updatedItems.some(item => item.priceChanged) || newlyAvailableItems.length > 0) {
      window.dispatchEvent(new CustomEvent('pricesUpdated', {
        detail: {
          updatedItems: updatedItems.filter(item => item.priceChanged),
          newlyAvailableItems: newlyAvailableItems.filter(item => !item.isNewItem)
        }
      }));
    }
    
    // Quantity update event
    if (updatedItems.some(item => item.quantityChanged)) {
      window.dispatchEvent(new CustomEvent('quantityUpdated', {
        detail: {
          updatedItems: updatedItems.filter(item => item.quantityChanged)
        }
      }));
    }
    
    // Item added event
    if (changeDetails?.type === 'add') {
      window.dispatchEvent(new CustomEvent('inventoryItemAdded', { detail: eventDetail }));
    }
    
    // Item removed event
    if (changeDetails?.type === 'delete' || removedItems.length > 0) {
      window.dispatchEvent(new CustomEvent('inventoryItemRemoved', {
        detail: { removedItems }
      }));
    }
    
    console.log('Inventory events dispatched:', {
      changeType: changeDetails?.type || 'update',
      newlyAvailableItems,
      updatedItems,
      removedItems
    });
    
  } catch (error) {
    console.error('Error saving inventory items:', error);
  }
};

// ✅ Enhanced: Calculate dynamic order total with better error handling
export const calculateOrderTotal = (orderItems) => {
  try {
    const inventoryItems = getInventoryItems();
    const inventoryDict = {};
    
    // Create lookup dictionary with both original and display names
    inventoryItems.forEach(item => {
      inventoryDict[item.item_name.toLowerCase()] = item;
      const displayName = getDisplayName(item.item_name);
      inventoryDict[displayName.toLowerCase()] = item;
    });
    
    // Count quantities of each item
    const itemCounts = {};
    orderItems.forEach(item => {
      const mappedName = ITEM_MAPPING[item];
      if (mappedName) {
        const lowerName = mappedName.toLowerCase();
        itemCounts[lowerName] = (itemCounts[lowerName] || 0) + 1;
      } else {
        // Try direct lookup if no mapping found
        const lowerName = item.toLowerCase();
        itemCounts[lowerName] = (itemCounts[lowerName] || 0) + 1;
      }
    });
    
    let total = 0;
    const itemDetails = [];
    
    // Calculate total and prepare item details
    Object.entries(itemCounts).forEach(([itemName, qty]) => {
      const inventoryItem = inventoryDict[itemName];
      const isOutOfStock = !inventoryItem || inventoryItem.quantity === 0;
      const isLowStock = inventoryItem && inventoryItem.quantity < (inventoryItem.min_stock || 5) && inventoryItem.quantity > 0;
      
      if (inventoryItem && inventoryItem.quantity > 0) {
        total += inventoryItem.price * qty;
      }
      
      // Find original item name from mapping or use display name
      const originalName = Object.keys(ITEM_MAPPING).find(key => 
        ITEM_MAPPING[key].toLowerCase() === itemName
      ) || getDisplayName(itemName);
      
      itemDetails.push({
        name: originalName,
        quantity: qty,
        isOutOfStock,
        isLowStock,
        price: inventoryItem?.price || 0,
        wasOutOfStock: false // Will be updated by animation system
      });
    });
    
    return { total, itemDetails };
  } catch (error) {
    console.error('Error calculating order total:', error);
    return { total: 0, itemDetails: [] };
  }
};

// ✅ Enhanced: Reduce inventory quantity with better tracking
export const reduceInventoryQuantity = (orderItems) => {
  try {
    const inventoryItems = getInventoryItems();
    let updated = false;
    const changedItems = [];
    
    console.log('Reducing inventory for items:', orderItems);

    const updatedInventory = inventoryItems.map(item => {
      let newQuantity = item.quantity;
      const originalQuantity = item.quantity;
      
      orderItems.forEach(orderItem => {
        const inventoryItemName = ITEM_MAPPING[orderItem];
        if (inventoryItemName && inventoryItemName.toLowerCase() === item.item_name.toLowerCase()) {
          if (newQuantity > 0) {
            newQuantity -= 1;
            updated = true;
            console.log(`Reduced ${item.item_name} from ${originalQuantity} to ${newQuantity}`);
          }
        }
      });
      
      if (originalQuantity !== newQuantity) {
        changedItems.push({
          name: getDisplayName(item.item_name),
          originalQuantity,
          newQuantity,
          wasOutOfStock: originalQuantity === 0,
          isNowOutOfStock: newQuantity === 0
        });
      }
      
      return {
        ...item,
        quantity: Math.max(0, newQuantity)
      };
    });

    if (updated) {
      saveInventoryItems(updatedInventory, { 
        type: 'order_delivery',
        changedItems
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error reducing inventory quantity:', error);
    return false;
  }
};

// ✅ Enhanced: Check item availability with detailed reporting
export const checkItemAvailability = (orderItems) => {
  try {
    const inventoryItems = getInventoryItems();
    const unavailableItems = [];
    const lowStockItems = [];
    
    orderItems.forEach(orderItem => {
      const inventoryItemName = ITEM_MAPPING[orderItem];
      if (inventoryItemName) {
        const inventoryItem = inventoryItems.find(item => 
          item.item_name.toLowerCase() === inventoryItemName.toLowerCase()
        );
        
        if (!inventoryItem || inventoryItem.quantity === 0) {
          unavailableItems.push(orderItem);
        } else if (inventoryItem.quantity < (inventoryItem.min_stock || 5)) {
          lowStockItems.push({
            name: orderItem,
            quantity: inventoryItem.quantity,
            minStock: inventoryItem.min_stock || 5
          });
        }
      } else {
        // If no mapping found, consider it unavailable
        unavailableItems.push(orderItem);
      }
    });
    
    if (lowStockItems.length > 0) {
      console.warn('Low stock items detected:', lowStockItems);
    }
    
    return unavailableItems;
  } catch (error) {
    console.error('Error checking item availability:', error);
    return orderItems; // Return all items as unavailable if error occurs
  }
};

// ✅ New: Get item by name (utility function)
export const getItemByName = (itemName) => {
  try {
    const inventoryItems = getInventoryItems();
    return inventoryItems.find(item => 
      item.item_name.toLowerCase() === itemName.toLowerCase() ||
      getDisplayName(item.item_name).toLowerCase() === itemName.toLowerCase()
    );
  } catch (error) {
    console.error('Error getting item by name:', error);
    return null;
  }
};

// ✅ New: Get low stock items
export const getLowStockItems = () => {
  try {
    const inventoryItems = getInventoryItems();
    return inventoryItems.filter(item => 
      item.quantity < (item.min_stock || 5) && item.quantity > 0
    );
  } catch (error) {
    console.error('Error getting low stock items:', error);
    return [];
  }
};

// ✅ New: Get out of stock items
export const getOutOfStockItems = () => {
  try {
    const inventoryItems = getInventoryItems();
    return inventoryItems.filter(item => item.quantity === 0);
  } catch (error) {
    console.error('Error getting out of stock items:', error);
    return [];
  }
};

// ✅ New: Format currency (utility function)
export const formatCurrency = (amount) => {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  } catch (error) {
    return `₹${amount.toFixed(2)}`;
  }
};

// ✅ New: Initialize default inventory (utility function)
export const initializeDefaultInventory = () => {
  const defaultMenu = [
    { item_id: "1", item_name: "Margherita Pizza", price: 150.00, quantity: 25, min_stock: 5 },
    { item_id: "2", item_name: "Chicken Burger", price: 80.00, quantity: 15, min_stock: 5 },
    { item_id: "3", item_name: "BBQ Burger", price: 90.00, quantity: 12, min_stock: 5 },
    { item_id: "4", item_name: "Fries", price: 50.00, quantity: 20, min_stock: 5 },
    { item_id: "5", item_name: "Loaded Fries", price: 70.00, quantity: 10, min_stock: 5 },
    { item_id: "6", item_name: "Onion Rings", price: 45.00, quantity: 18, min_stock: 5 },
    { item_id: "7", item_name: "Garlic Bread", price: 60.00, quantity: 12, min_stock: 5 },
    { item_id: "8", item_name: "Coke", price: 40.00, quantity: 30, min_stock: 10 },
    { item_id: "9", item_name: "Milkshake", price: 80.00, quantity: 15, min_stock: 5 },
    { item_id: "10", item_name: "Smoothie", price: 90.00, quantity: 12, min_stock: 5 },
    { item_id: "11", item_name: "Veggie Wrap", price: 85.00, quantity: 8, min_stock: 5 },
    { item_id: "12", item_name: "Fish & Chips", price: 95.00, quantity: 14, min_stock: 5 }
  ];
  
  localStorage.setItem('menu', JSON.stringify(defaultMenu));
  return defaultMenu;
};
