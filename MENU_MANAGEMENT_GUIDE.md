# Menu Management Guide - Adgimani Web

## Overview
The menu system is managed through MongoDB with images displayed from the React assets folder. This guide shows you exactly where and how to manage menu items, prices, and images.

---

## 🖼️ **Menu Images - How They Work**

### Current Setup
- **Images Location**: `frontend/src/assets/` folder
- **Available Images**: 
  - Samosa.png
  - Masala Appe.png
  - Bata Vada.jpg
  - medu_vada.jpg
  - masala_dosa.jpg
  - Bisi Beli Bath.jpg
  - Ghee Pudi Thatte Idli.png
  - Kachori.png

### Image Import (Frontend)
**File**: [`frontend/src/pages/Menu.js`](frontend/src/pages/Menu.js)

The images are imported at the top of the file:
```javascript
import samosaImg from "../assets/Samosa.png";
import masalaAppeImg from "../assets/Masala Appe.png";
import bataVadaImg from "../assets/Bata Vada.jpg";
// ... more imports
```

Then mapped using `imageMap` dictionary:
```javascript
const imageMap = {
  "Samosa.png": samosaImg,
  "Masala Appe.png": masalaAppeImg,
  "Bata Vada.jpg": bataVadaImg,
  // ... more mappings
};
```

### How to Add New Images
1. **Add your image file** to `frontend/src/assets/` folder
2. **Import the image** at the top of `Menu.js`:
   ```javascript
   import yourImageImg from "../assets/yourImage.jpg";
   ```
3. **Add to imageMap**:
   ```javascript
   const imageMap = {
     "yourImage.jpg": yourImageImg,
     // ... existing mappings
   };
   ```
4. **Use in database** (see MongoDB section below)

---

## 💰 **Change Menu Prices - Two Methods**

### Method 1: Direct MongoDB Query (Recommended)
**Best for**: Quick price updates

**Steps**:
1. Open MongoDB Compass or MongoDB shell
2. Navigate to: `adgimani_db` → `menuitems` collection
3. Find the item you want to update
4. Edit the `price` field directly
5. Save changes

**Example**:
```javascript
db.menuitems.updateOne(
  { name: "Samosa" },
  { $set: { price: 25 } }
)
```

### Method 2: Backend Route (For Advanced Use)
**File**: [`backend/routes/menuRoutes.js`](backend/routes/menuRoutes.js)

The seed data is located in the `/seed` POST route. You can:
1. Update prices in the seed data array (lines 40-90)
2. Call `POST /api/menu/seed` endpoint to reseed (only works if no items exist)
3. Or use MongoDB directly (Method 1) for existing items

---

## 📊 **Menu Item Data Structure**

**File**: [`backend/models/MenuItem.js`](backend/models/MenuItem.js)

Each menu item has this structure:
```javascript
{
  _id: ObjectId,
  name: String,           // Unique item name
  price: Number,          // Price in rupees (₹)
  rating: Number,         // 0-5 stars (default: 4.5)
  img: String,            // Image file name (e.g., "Samosa.png")
  category: String,       // "Snacks" | "Meals" | "Sweets" | "Beverages"
  bestseller: Boolean,    // Shows 🔥 badge (default: false)
  description: String,    // Short description
  available: Boolean,     // true = show in menu (default: true)
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔄 **Current Menu Items & Their Details**

| Item | Price | Category | Image | Rating | Bestseller |
|------|-------|----------|-------|--------|-----------|
| Samosa | ₹20 | Snacks | Samosa.png | 4.5 | ✅ |
| Masala Appe | ₹40 | Snacks | Masala Appe.png | 4.4 | ❌ |
| Bata Vada | ₹35 | Snacks | Bata Vada.jpg | 4.7 | ✅ |
| Medu Vada | ₹30 | Snacks | medu_vada.jpg | 4.6 | ❌ |
| Masala Dosa | ₹120 | Meals | masala_dosa.jpg | 4.8 | ✅ |
| Bisi Beli Bath | ₹100 | Meals | Bisi Beli Bath.jpg | 4.6 | ❌ |
| Ghee Pudi Idli | ₹50 | Meals | Ghee Pudi Thatte Idli.png | 4.7 | ❌ |
| Kachori | ₹25 | Snacks | Kachori.png | 4.5 | ❌ |

---

## ✏️ **Edit Menu Items**

### To Change an Item's Price
**Use MongoDB Compass:**
1. Go to `adgimani_db` → `menuitems`
2. Click the item you want to edit
3. Update the `price` field
4. Click the checkmark to save

**Example Commands**:
```javascript
// Update single item
db.menuitems.updateOne(
  { name: "Samosa" },
  { $set: { price: 25 } }
)

// Update multiple items
db.menuitems.updateMany(
  { category: "Snacks" },
  { $set: { price: 40 } }
)
```

### To Change an Item's Rating
```javascript
db.menuitems.updateOne(
  { name: "Samosa" },
  { $set: { rating: 4.7 } }
)
```

### To Mark an Item as Bestseller
```javascript
db.menuitems.updateOne(
  { name: "Samosa" },
  { $set: { bestseller: true } }
)
```

### To Hide an Item from Menu
```javascript
db.menuitems.updateOne(
  { name: "Samosa" },
  { $set: { available: false } }
)
```

### To Add a New Item
```javascript
db.menuitems.insertOne({
  name: "New Item",
  price: 50,
  rating: 4.5,
  img: "newitem.jpg",
  category: "Snacks",
  bestseller: false,
  description: "Item description",
  available: true
})
```

---

## 🔗 **Related Files**

| File | Purpose |
|------|---------|
| [backend/models/MenuItem.js](backend/models/MenuItem.js) | Database schema for menu items |
| [backend/routes/menuRoutes.js](backend/routes/menuRoutes.js) | API endpoints & seed data |
| [frontend/src/pages/Menu.js](frontend/src/pages/Menu.js) | Menu display component |
| [frontend/src/assets/](frontend/src/assets/) | Image files folder |

---

## 🚀 **Quick Actions**

### Display Menu in Frontend
**File**: [frontend/src/pages/Menu.js](frontend/src/pages/Menu.js)
- Images are automatically imported and mapped
- Database items are fetched from backend API
- Images display at `http://localhost:3000/menu`

### API Endpoints
```
GET /api/menu               - Get all available items
GET /api/menu/:id          - Get single item by ID
POST /api/menu/seed        - Seed initial data (one-time)
```

---

## 📝 **Modification Checklist**

- [ ] To change price: Edit MongoDB `price` field
- [ ] To add image: Add image to `frontend/src/assets/`
- [ ] To use image: Import in Menu.js and add to imageMap
- [ ] To create item: Insert new document in MongoDB
- [ ] To mark bestseller: Set `bestseller: true` in MongoDB
- [ ] To remove item: Set `available: false` in MongoDB

---

## ⚠️ **Important Notes**

1. **Images must be imported** in Menu.js - static paths won't work
2. **Image file names** in MongoDB must match the keys in `imageMap`
3. **Categories** must be one of: "Snacks", "Meals", "Sweets", "Beverages"
4. **Prices** are in Indian Rupees (₹)
5. **Ratings** should be between 0 and 5
6. **Available flag** controls visibility (true = visible, false = hidden)

---

## 🆘 **Troubleshooting**

### Images not showing
- Check image file exists in `frontend/src/assets/`
- Verify image is imported in Menu.js
- Check imageMap has correct file name mapping

### Price not updating
- Clear browser cache (Ctrl+F5)
- Verify change in MongoDB Compass
- Check backend is running on port 5000

### New items not showing
- Restart frontend dev server
- Verify `available: true` in MongoDB
- Check item `category` is valid

---

**Last Updated**: January 24, 2026
