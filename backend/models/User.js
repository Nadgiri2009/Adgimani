const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    role: { type: String, default: "user" },
    // // 🔐 Forgot password fields
    resetOTP: String,
    resetOTPExpiry: Date,
    // Payment methods
    paymentMethods: [
      {
        label: String,
        type: { type: String, enum: ["card", "upi"] },
        detail: String,
        meta: String
      }
    ],
    // Delivery addresses
    addresses: [
      {
        label: String,
        line: String,
        city: String,
        phone: String,
        isDefault: { type: Boolean, default: false }
      }
    ]
  },
  { timestamps: true }
);

// ✅ THIS LINE IS CRITICAL
module.exports = mongoose.model("User", userSchema);
