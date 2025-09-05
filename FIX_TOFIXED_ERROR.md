# Fix for TypeError: Cannot read properties of undefined (reading 'toFixed')

## Issue
The UserOrders page was throwing a `TypeError: Cannot read properties of undefined (reading 'toFixed')` error at line 535. This was happening because the code was trying to call `toFixed()` on undefined values.

## Root Cause
The error occurred in the order items mapping where:
1. `item.price` was undefined
2. `item.quantity` was undefined  
3. `order.total_amount` was undefined
4. `selectedOrder.total_amount` was undefined

## Fixes Applied

### 1. Fixed Order Item Price Display
```typescript
// Before: Could cause TypeError if item.price is undefined
Quantity: {item.quantity} × ₹{item.price.toFixed(2)}

// After: Safe access with fallback
Quantity: {item.quantity || 0} × ₹{(item.price || 0).toFixed(2)}
```

### 2. Fixed Order Item Total Calculation
```typescript
// Before: Could cause TypeError if item.price or item.quantity is undefined
₹{(item.price * item.quantity).toFixed(2)}

// After: Safe calculation with fallbacks
₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
```

### 3. Fixed Order Total Amount Display
```typescript
// Before: Could cause TypeError if total_amount is undefined
₹{order.total_amount.toFixed(2)}
₹{selectedOrder.total_amount.toFixed(2)}

// After: Safe access with fallback
₹{(order.total_amount || 0).toFixed(2)}
₹{(selectedOrder.total_amount || 0).toFixed(2)}
```

### 4. Added Product Name Fallback
```typescript
// Before: Could display undefined
{item.product_name}

// After: Safe display with fallback
{item.product_name || 'Unknown Product'}
```

### 5. Fixed Copy Details Function
```typescript
// Before: Could cause TypeError in copy function
Total: ₹${selectedOrder.total_amount.toFixed(2)}

// After: Safe access with fallback
Total: ₹${(selectedOrder.total_amount || 0).toFixed(2)}
```

## All Fixed Locations

1. **Line 535**: `item.price.toFixed(2)` → `(item.price || 0).toFixed(2)`
2. **Line 540**: `(item.price * item.quantity).toFixed(2)` → `((item.price || 0) * (item.quantity || 0)).toFixed(2)`
3. **Line 213**: `selectedOrder.total_amount.toFixed(2)` → `(selectedOrder.total_amount || 0).toFixed(2)`
4. **Line 363**: `order.total_amount.toFixed(2)` → `(order.total_amount || 0).toFixed(2)`
5. **Line 459**: `selectedOrder.total_amount.toFixed(2)` → `(selectedOrder.total_amount || 0).toFixed(2)`
6. **Line 532**: `item.product_name` → `item.product_name || 'Unknown Product'`
7. **Line 535**: `item.quantity` → `item.quantity || 0`

## Testing

### Before Fix
- ❌ TypeError: Cannot read properties of undefined (reading 'toFixed')
- ❌ Page crashes when viewing order details
- ❌ Console shows multiple errors

### After Fix
- ✅ No more TypeError errors
- ✅ Order details display properly
- ✅ All prices show as ₹0.00 if data is missing
- ✅ Product names show "Unknown Product" if missing
- ✅ Quantities show 0 if missing

## Expected Behavior

1. **Order List**: Displays orders with safe price formatting
2. **View Details**: Modal opens without errors
3. **Order Items**: Shows items with fallback values for missing data
4. **Price Display**: Shows ₹0.00 for missing prices
5. **Product Names**: Shows "Unknown Product" for missing names
6. **Quantities**: Shows 0 for missing quantities

## Files Modified
- `src/pages/UserOrders.tsx` - Added null safety checks for all numeric operations

## Result
The UserOrders page now handles missing or undefined data gracefully without throwing errors. All price calculations and displays are safe from TypeError exceptions.
