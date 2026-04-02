const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

let OTP_STORE = {}; // temp (use Redis in production)

/* SEND OTP */
router.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);

  OTP_STORE[phone] = otp;

  console.log("OTP (DEV ONLY):", otp); // replace with SMS API

  res.json({ msg: "OTP sent" });
});

/* VERIFY OTP */
router.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;

  if (OTP_STORE[phone] != otp)
    return res.status(400).json({ msg: "Invalid OTP" });

  let user = await User.findOne({ phone });
  if (!user) {
    user = await User.create({
      name: "OTP User",
      phone,
      email: `${phone}@otp.com`,
      password: "OTP_LOGIN"
    });
  }

  const token = jwt.sign({ id: user._id }, "SECRET_KEY", {
    expiresIn: "1d"
  });

  delete OTP_STORE[phone];

  res.json({
    token,
    name: user.name,
    phone
  });
});

module.exports = router;
