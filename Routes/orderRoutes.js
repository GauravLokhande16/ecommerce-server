const express = require("express");
const asyncHandle = require("express-async-handler");
const protect = require("../Middleware/AuthMiddleware");
const Order = require("../Models/OrderModel");

const orderRouter = express.Router();

orderRouter.post(
  "/",
  protect,
  asyncHandle(async (req, res) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No Order items");
    } else {
      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        isPaid
      });

      const createOrder = await order.save();
      res.status(201).json(createOrder);
    }
  })
);

// User login order
orderRouter.get(
  "/",
  protect,
  asyncHandle(async (req, res) => {
    const order = await Order.find({ user: req.user._id }).sort({ _id: -1 });
    res.json(order);
  })
);

// order details
orderRouter.get(
  "/:id",
  protect,
  asyncHandle(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order Not Found");
    }
  })
);

// ORDER Is Paid
orderRouter.put(
  "/:id/pay",
  protect,
  asyncHandle(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true,
        order.paidAt = Date.now;
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      const updateOrder = await order.save();
      res.json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Order Not Found");
    }
  })
);

module.exports = orderRouter;
