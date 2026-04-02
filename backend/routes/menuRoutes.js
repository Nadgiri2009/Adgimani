const express = require("express");
const router = express.Router();
const MenuItem = require("../models/MenuItem");

// Get all menu items
router.get("/", async (req, res) => {
  try {
    const items = await MenuItem.find({ available: true }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch menu items" });
  }
});

// Get single menu item by ID
router.get("/:id", async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch item" });
  }
});

// Seed initial menu items (for first-time setup)
router.post("/seed", async (req, res) => {
  try {
    const count = await MenuItem.countDocuments();
    if (count > 0) {
      return res.json({ message: "Menu items already exist" });
    }

    const menuItems = [
      {
        name: "Samosa",
        price: 20,
        rating: 4.5,
        img: "Samosa.png",
        category: "Snacks",
        bestseller: true,
        description: "Crispy golden triangles filled with spiced potatoes"
      },
      {
        name: "Masala Appe",
        price: 40,
        rating: 4.4,
        img: "Masala Appe.png",
        category: "Snacks",
        description: "Savory spheres with spiced lentils and vegetables"
      },
      {
        name: "Bata Vada",
        price: 35,
        rating: 4.7,
        img: "Bata Vada.jpg",
        category: "Snacks",
        bestseller: true,
        description: "Crispy fried potato fritters with aromatic spices"
      },
      {
        name: "Medu Vada",
        price: 30,
        rating: 4.6,
        img: "medu_vada.jpg",
        category: "Snacks",
        description: "Soft and fluffy urad dal fritters"
      },
      {
        name: "Masala Dosa",
        price: 120,
        rating: 4.8,
        img: "masala_dosa.jpg",
        category: "Meals",
        bestseller: true,
        description: "Crispy crepe with potato and onion filling"
      },
      {
        name: "Bisi Beli Bath",
        price: 100,
        rating: 4.6,
        img: "Bisi Beli Bath.jpg",
        category: "Meals",
        description: "Spiced rice with lentils and vegetables"
      },
      {
        name: "Ghee Pudi Idli",
        price: 50,
        rating: 4.7,
        img: "Ghee Pudi Thatte Idli.png",
        category: "Meals",
        description: "Steamed rice cakes with ghee and spice powder"
      },
      {
        name: "Kachori",
        price: 25,
        rating: 4.5,
        img: "Kachori.png",
        category: "Snacks",
        description: "Flaky pastry filled with spiced lentils"
      }
    ];

    await MenuItem.insertMany(menuItems);
    res.json({ message: "Menu items seeded successfully", count: menuItems.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to seed menu items" });
  }
});

module.exports = router;
