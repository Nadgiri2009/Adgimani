const mongoose = require("mongoose");
const MenuItem = require("./models/MenuItem");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/adgimani_db")
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    // Delete all existing menu items
    const deleteResult = await MenuItem.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} old menu items`);

    // Insert new menu items with correct image names
    const menuItems = [
      {
        name: "Samosa",
        price: 20,
        rating: 4.5,
        img: "Samosa.png",
        category: "Snacks",
        bestseller: true,
        description: "Crispy golden triangles filled with spiced potatoes",
        available: true
      },
      {
        name: "Masala Appe",
        price: 40,
        rating: 4.4,
        img: "Masala Appe.png",
        category: "Snacks",
        description: "Savory spheres with spiced lentils and vegetables",
        available: true
      },
      {
        name: "Bata Vada",
        price: 35,
        rating: 4.7,
        img: "Bata Vada.jpg",
        category: "Snacks",
        bestseller: true,
        description: "Crispy fried potato fritters with aromatic spices",
        available: true
      },
      {
        name: "Medu Vada",
        price: 30,
        rating: 4.6,
        img: "medu_vada.jpg",
        category: "Snacks",
        description: "Soft and fluffy urad dal fritters",
        available: true
      },
      {
        name: "Masala Dosa",
        price: 120,
        rating: 4.8,
        img: "masala_dosa.jpg",
        category: "Meals",
        bestseller: true,
        description: "Crispy crepe with potato and onion filling",
        available: true
      },
      {
        name: "Bisi Beli Bath",
        price: 100,
        rating: 4.6,
        img: "Bisi Beli Bath.jpg",
        category: "Meals",
        description: "Spiced rice with lentils and vegetables",
        available: true
      },
      {
        name: "Ghee Pudi Idli",
        price: 50,
        rating: 4.7,
        img: "Ghee Pudi Thatte Idli.png",
        category: "Meals",
        description: "Steamed rice cakes with ghee and spice powder",
        available: true
      },
      {
        name: "Kachori",
        price: 25,
        rating: 4.5,
        img: "Kachori.png",
        category: "Snacks",
        description: "Flaky pastry filled with spiced lentils",
        available: true
      }
    ];

    const result = await MenuItem.insertMany(menuItems);
    console.log(`✅ Successfully added ${result.length} new menu items with images!`);

    console.log("\n📋 Menu Items:");
    result.forEach((item, idx) => {
      console.log(`   ${idx + 1}. ${item.name} - ₹${item.price} (${item.img})`);
    });

    console.log("\n✨ Database updated successfully! Refresh your menu page to see the images.");
    
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
