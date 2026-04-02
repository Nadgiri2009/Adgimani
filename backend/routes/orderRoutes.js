const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const protect = require("../middleware/authMiddleware");

// Create new order
router.post("/create", protect, async (req, res) => {
  try {
    const { items, totalPrice, totalItems, deliveryCharge, taxAmount, grandTotal, deliveryAddress, paymentMethod } = req.body;

    // Validation
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!deliveryAddress || !deliveryAddress.name || !deliveryAddress.phone || !deliveryAddress.address) {
      return res.status(400).json({ message: "Delivery address is incomplete" });
    }

    // Calculate values if not provided
    const calculatedDeliveryCharge = deliveryCharge !== undefined ? deliveryCharge : (totalPrice < 500 ? 30 : 0);
    const calculatedTaxAmount = taxAmount !== undefined ? taxAmount : Math.round((totalPrice + calculatedDeliveryCharge) * 0.05);
    const calculatedGrandTotal = grandTotal !== undefined ? grandTotal : totalPrice + calculatedDeliveryCharge + calculatedTaxAmount;

    const order = new Order({
      user: req.user._id,
      items,
      totalPrice,
      totalItems,
      deliveryCharge: calculatedDeliveryCharge,
      taxAmount: calculatedTaxAmount,
      grandTotal: calculatedGrandTotal,
      deliveryAddress,
      paymentMethod: paymentMethod || "COD"
    });

    await order.save();

    res.status(201).json({
      message: "Order placed successfully",
      orderNumber: order.orderNumber,
      order
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ 
      message: "Failed to create order",
      error: error.message 
    });
  }
});

// Get all orders for logged-in user
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Get single order by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if order belongs to the user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

// Update order status (admin only - can be enhanced later)
router.put("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order status updated", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update order" });
  }
});

module.exports = router;
