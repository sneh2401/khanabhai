// ✅ SIMPLIFIED: Generic item name mapping (no varieties)
const ITEM_MAPPING = {
  // Voice orders use these names → Maps to inventory names (1:1 mapping)
  "burger": "burger",
  "pizza": "pizza", 
  "fries": "fries",
  "garlic bread": "garlic bread",
  "pasta": "pasta",
  "salad": "salad"
};

// ✅ SIMPLIFIED: Direct lookup function - simple 1:1 mapping
const getInventoryItemName = (orderItemName) => {
  // First try direct match (exact name from payment)
  const directMatch = orderItemName.trim();
  
  // Then try mapping from voice order names
  const mappedName = ITEM_MAPPING[orderItemName.toLowerCase()];
  
  return mappedName || directMatch;
};

// ✅ Enhanced: Get inventory items with error handling
export const getInventoryItems = () => {
  try {
    const stored = localStorage.getItem('menu');
    if (stored) {
      const items = JSON.parse(stored);
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

// ✅ SIMPLIFIED: Generic display names only (no varieties)
export const getDisplayName = (itemName) => {
  const nameMap = {
    'pizza': 'pizza',
    'burger': 'burger', 
    'fries': 'fries',
    'garlic bread': 'garlic bread',
    'pasta': 'pasta',
    'salad': 'salad'
  };
  return nameMap[itemName.toLowerCase()] || itemName;
};

// ✅ FIXED: Get current inventory status for dashboard
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

// ✅ FIXED: Calculate dynamic order total with corrected item matching
export const calculateOrderTotal = (orderItems) => {
  try {
    const inventoryItems = getInventoryItems();
    console.log('🧮 Calculating total for order items:', orderItems);
    console.log('📦 Available inventory items:', inventoryItems.map(i => i.item_name));
    
    // Create lookup dictionary with flexible matching
    const inventoryDict = {};
    inventoryItems.forEach(item => {
      // Add by exact name (case-insensitive)
      inventoryDict[item.item_name.toLowerCase()] = item;
      
      // Add by display name variations
      const displayName = getDisplayName(item.item_name);
      inventoryDict[displayName.toLowerCase()] = item;
    });
    
    // Count quantities of each item in the order
    const itemCounts = {};
    orderItems.forEach(orderItem => {
      const normalizedName = orderItem.toLowerCase().trim();
      const inventoryName = getInventoryItemName(orderItem);
      const lookupKey = inventoryName.toLowerCase();
      
      itemCounts[lookupKey] = (itemCounts[lookupKey] || 0) + 1;
    });
    
    console.log('📊 Item counts:', itemCounts);
    
    let total = 0;
    const itemDetails = [];
    
    // Calculate total and prepare item details
    Object.entries(itemCounts).forEach(([itemKey, qty]) => {
      const inventoryItem = inventoryDict[itemKey];
      
      console.log(`🔍 Looking up "${itemKey}":`, inventoryItem ? 'FOUND' : 'NOT FOUND');
      
      const isOutOfStock = !inventoryItem || inventoryItem.quantity === 0;
      const isLowStock = inventoryItem && inventoryItem.quantity < (inventoryItem.min_stock || 5) && inventoryItem.quantity > 0;
      
      if (inventoryItem && inventoryItem.quantity > 0) {
        total += inventoryItem.price * qty;
      }
      
      // Use original order item name for display
      const originalName = orderItems.find(item => 
        getInventoryItemName(item).toLowerCase() === itemKey
      ) || itemKey;
      
      itemDetails.push({
        name: originalName,
        quantity: qty,
        isOutOfStock,
        isLowStock,
        price: inventoryItem?.price || 0,
        wasOutOfStock: false
      });
    });
    
    console.log('💰 Total calculated:', total, 'Item details:', itemDetails);
    return { total, itemDetails };
  } catch (error) {
    console.error('Error calculating order total:', error);
    return { total: 0, itemDetails: [] };
  }
};

// ✅ FIXED: Reduce inventory quantity with corrected item matching
export const reduceInventoryQuantity = (orderItems) => {
  try {
    const inventoryItems = getInventoryItems();
    let updated = false;
    const changedItems = [];
    
    console.log('📉 Reducing inventory for order items:', orderItems);
    console.log('📦 Current inventory:', inventoryItems.map(i => `${i.item_name}: ${i.quantity}`));

    const updatedInventory = inventoryItems.map(inventoryItem => {
      let newQuantity = inventoryItem.quantity;
      const originalQuantity = inventoryItem.quantity;
      
      // Check each order item against this inventory item
      orderItems.forEach(orderItem => {
        const inventoryName = getInventoryItemName(orderItem);
        
        // ✅ FIXED: Direct string comparison with proper normalization
        if (inventoryName.toLowerCase().trim() === inventoryItem.item_name.toLowerCase().trim()) {
          if (newQuantity > 0) {
            newQuantity -= 1;
            updated = true;
            console.log(`✅ Reduced ${inventoryItem.item_name} from ${originalQuantity} to ${newQuantity}`);
          } else {
            console.log(`⚠️ Cannot reduce ${inventoryItem.item_name} - out of stock`);
          }
        }
      });
      
      if (originalQuantity !== newQuantity) {
        changedItems.push({
          name: getDisplayName(inventoryItem.item_name),
          originalQuantity,
          newQuantity,
          wasOutOfStock: originalQuantity === 0,
          isNowOutOfStock: newQuantity === 0
        });
      }
      
      return {
        ...inventoryItem,
        quantity: Math.max(0, newQuantity)
      };
    });

    if (updated) {
      // Save updated inventory
      localStorage.setItem('menu', JSON.stringify(updatedInventory));
      
      // Dispatch inventory update event
      window.dispatchEvent(new CustomEvent('inventoryUpdated', {
        detail: {
          updatedItems: changedItems,
          changeType: 'order_delivery',
          timestamp: new Date().toISOString()
        }
      }));
      
      console.log('✅ Inventory successfully reduced:', changedItems);
      return true;
    }
    
    console.log('⚠️ No inventory items were reduced');
    return false;
  } catch (error) {
    console.error('❌ Error reducing inventory quantity:', error);
    return false;
  }
};

// ✅ FIXED: Check item availability with corrected matching
export const checkItemAvailability = (orderItems) => {
  try {
    const inventoryItems = getInventoryItems();
    const unavailableItems = [];
    
    console.log('🔍 Checking availability for:', orderItems);
    
    orderItems.forEach(orderItem => {
      const inventoryName = getInventoryItemName(orderItem);
      const inventoryItem = inventoryItems.find(item => 
        item.item_name.toLowerCase().trim() === inventoryName.toLowerCase().trim()
      );
      
      if (!inventoryItem || inventoryItem.quantity === 0) {
        unavailableItems.push(orderItem);
        console.log(`❌ ${orderItem} is not available`);
      } else {
        console.log(`✅ ${orderItem} is available (${inventoryItem.quantity} in stock)`);
      }
    });
    
    return unavailableItems;
  } catch (error) {
    console.error('Error checking item availability:', error);
    return orderItems;
  }
};

// ✅ Enhanced: Save inventory items with comprehensive event tracking
export const saveInventoryItems = (items, changeDetails = null) => {
  try {
    const previousItems = getInventoryItems();
    localStorage.setItem('menu', JSON.stringify(items));
    
    const newlyAvailableItems = [];
    const updatedItems = [];
    const removedItems = [];
    
    items.forEach(currentItem => {
      const previousItem = previousItems.find(prev => prev.item_id === currentItem.item_id);
      const displayName = getDisplayName(currentItem.item_name);
      
      if (previousItem) {
        const wasOutOfStock = previousItem.quantity === 0;
        const isNowInStock = currentItem.quantity > 0;
        const quantityChanged = previousItem.quantity !== currentItem.quantity;
        const priceChanged = previousItem.price !== currentItem.price;
        
        if (wasOutOfStock && isNowInStock) {
          newlyAvailableItems.push({
            name: displayName,
            quantity: currentItem.quantity,
            price: currentItem.price,
            previousQuantity: previousItem.quantity
          });
        }
        
        if (quantityChanged || priceChanged) {
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
        newlyAvailableItems.push({
          name: displayName,
          quantity: currentItem.quantity,
          price: currentItem.price,
          isNewItem: true
        });
      }
    });
    
    previousItems.forEach(previousItem => {
      const stillExists = items.find(item => item.item_id === previousItem.item_id);
      if (!stillExists) {
        removedItems.push(getDisplayName(previousItem.item_name));
      }
    });
    
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
    
    window.dispatchEvent(new CustomEvent('inventoryUpdated', { detail: eventDetail }));
    
    if (updatedItems.some(item => item.priceChanged) || newlyAvailableItems.length > 0) {
      window.dispatchEvent(new CustomEvent('pricesUpdated', {
        detail: {
          updatedItems: updatedItems.filter(item => item.priceChanged),
          newlyAvailableItems: newlyAvailableItems.filter(item => !item.isNewItem)
        }
      }));
    }
    
    if (updatedItems.some(item => item.quantityChanged)) {
      window.dispatchEvent(new CustomEvent('quantityUpdated', {
        detail: {
          updatedItems: updatedItems.filter(item => item.quantityChanged)
        }
      }));
    }
    
    if (changeDetails?.type === 'add') {
      window.dispatchEvent(new CustomEvent('inventoryItemAdded', { detail: eventDetail }));
    }
    
    if (changeDetails?.type === 'delete' || removedItems.length > 0) {
      window.dispatchEvent(new CustomEvent('inventoryItemRemoved', {
        detail: { removedItems }
      }));
    }
    
  } catch (error) {
    console.error('Error saving inventory items:', error);
  }
};

// ✅ Enhanced: Format currency utility
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
