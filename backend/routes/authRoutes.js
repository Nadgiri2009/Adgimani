const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
console.log("user model:", User);

const router = express.Router();

/* ================= SIGNUP ================= */
router.post(
  "/signup",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("phone").isLength({ min: 10, max: 10 }),
    body("password").isLength({ min: 6 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, phone, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword
      });

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role
        }
      });
    } catch (err) {
      console.error("Signup error:", err.message);
      res.status(500).json({ message: "Signup failed" });
    }
  }
);

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Email:", email);
    console.log("Entered password:", password);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("DB password:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Login failed" });
  }
});

/* ================= forgot password ================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOTP = otp;
    user.resetOTPExpiry = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    // 🔴 TEMP: Log OTP (later send via email/SMS)
    console.log("Password reset OTP:", otp);

    res.json({ message: "OTP sent to registered email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
/* ================= forgot password ================= */

/* ================= password updated ================= */
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      user.resetOTP !== otp ||
      user.resetOTPExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;

    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
/* ================= password updated ================= */

/* ================= PROFILE ================= */
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    res.json(user);
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

/* ================= UPDATE PROFILE ================= */
router.put("/update", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { name, phone, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { name, phone, avatar },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch {
    res.status(500).json({ message: "Profile update failed" });
  }
});

/* ================= PAYMENT METHODS ================= */
// Get payment methods
router.get("/payment-methods", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("paymentMethods");

    res.json(user.paymentMethods || []);
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Add payment method
router.post("/payment-methods", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { label, type, detail, meta } = req.body;

    const user = await User.findById(decoded.id);
    user.paymentMethods.push({ label, type, detail, meta });
    await user.save();

    res.json(user.paymentMethods);
  } catch {
    res.status(500).json({ message: "Failed to add payment method" });
  }
});

// Update payment method
router.put("/payment-methods/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { label, type, detail, meta } = req.body;

    const user = await User.findById(decoded.id);
    const pm = user.paymentMethods.id(req.params.id);
    if (!pm) return res.status(404).json({ message: "Payment method not found" });

    pm.label = label;
    pm.type = type;
    pm.detail = detail;
    pm.meta = meta;
    await user.save();

    res.json(user.paymentMethods);
  } catch {
    res.status(500).json({ message: "Failed to update payment method" });
  }
});

// Delete payment method
router.delete("/payment-methods/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    user.paymentMethods = user.paymentMethods.filter(
      (pm) => pm._id.toString() !== req.params.id
    );
    await user.save();

    res.json(user.paymentMethods);
  } catch {
    res.status(500).json({ message: "Failed to delete payment method" });
  }
});

/* ================= ADDRESSES ================= */
// Get addresses
router.get("/addresses", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("addresses");

    res.json(user.addresses || []);
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Add address
router.post("/addresses", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { label, line, city, phone, isDefault } = req.body;

    const user = await User.findById(decoded.id);
    
    // If setting as default, unset others
    if (isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    user.addresses.push({ label, line, city, phone, isDefault });
    await user.save();

    res.json(user.addresses);
  } catch {
    res.status(500).json({ message: "Failed to add address" });
  }
});

// Update address
router.put("/addresses/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { label, line, city, phone, isDefault } = req.body;

    const user = await User.findById(decoded.id);
    const addr = user.addresses.id(req.params.id);
    if (!addr) return res.status(404).json({ message: "Address not found" });

    // If setting as default, unset others
    if (isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    addr.label = label;
    addr.line = line;
    addr.city = city;
    addr.phone = phone;
    addr.isDefault = isDefault;
    await user.save();

    res.json(user.addresses);
  } catch {
    res.status(500).json({ message: "Failed to update address" });
  }
});

// Delete address
router.delete("/addresses/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== req.params.id
    );
    await user.save();

    res.json(user.addresses);
  } catch {
    res.status(500).json({ message: "Failed to delete address" });
  }
});

module.exports = router;