const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/google", async (req, res) => {
  const { email, name } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      phone: "GOOGLE_USER",
      password: "GOOGLE_AUTH"
    });
  }

  const token = jwt.sign({ id: user._id }, "SECRET_KEY", {
    expiresIn: "1d"
  });

  res.json({
    token,
    name: user.name,
    email: user.email
  });
});

module.exports = router;
