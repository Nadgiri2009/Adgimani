const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    price: {
      type: Number,
      required: true
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5
    },
    img: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ["Snacks", "Meals", "Sweets", "Beverages"]
    },
    bestseller: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      required: true
    },
    available: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
