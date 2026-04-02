const mongoose = require("mongoose");
const dotenv = require("dotenv");
const MenuItem = require("./models/MenuItem");

dotenv.config();

const menuItems = [
  {
    name: "Samosa",
    price: 20,
    rating: 4.5,
    img: "/static/media/food1.png",
    category: "Snacks",
    bestseller: true,
    description: "Crispy golden triangles filled with spiced potatoes"
  },
  {
    name: "Poha",
    price: 40,
    rating: 4.4,
    img: "/static/media/food3.jpg",
    category: "Snacks",
    description: "Flattened rice delicately tempered with curry leaves"
  },
  {
    name: "Veg Thali",
    price: 120,
    rating: 4.8,
    img: "/static/media/food2.jpg",
    category: "Meals",
    bestseller: true,
    description: "Complete meal with rice, roti, dal, and curries"
  },
  {
    name: "Mini Thali",
    price: 90,
    rating: 4.6,
    img: "/static/media/food6.jpg",
    category: "Meals",
    description: "Perfect portion thali for lighter appetite"
  },
  {
    name: "Ladoo",
    price: 30,
    rating: 4.6,
    img: "/static/media/food4.jpg",
    category: "Sweets",
    description: "Traditional sweet balls made with gram flour"
  },
  {
    name: "Mysore Pak",
    price: 35,
    rating: 4.7,
    img: "/static/media/food5.png",
    category: "Sweets",
    bestseller: true,
    description: "Melt-in-mouth South Indian sweet delicacy"
  },
  {
    name: "Buttermilk",
    price: 20,
    rating: 4.5,
    img: "/static/media/food7.png",
    category: "Beverages",
    description: "Cool refreshing spiced yogurt drink"
  },
  {
    name: "Filter Coffee",
    price: 25,
    rating: 4.8,
    img: "/static/media/food8.png",
    category: "Beverages",
    bestseller: true,
    description: "Authentic South Indian filter coffee"
  }
];

const seedMenu = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Check if items already exist
    const count = await MenuItem.countDocuments();
    if (count > 0) {
      console.log("Menu items already exist. Skipping seed.");
      process.exit(0);
    }

    // Insert menu items
    await MenuItem.insertMany(menuItems);
    console.log(`✅ ${menuItems.length} menu items seeded successfully!`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding menu:", error);
    process.exit(1);
  }
};

seedMenu();
