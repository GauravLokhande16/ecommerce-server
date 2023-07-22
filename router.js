const express = require("express");
const asyncHandler = require("express-async-handler");
const User = require("./Models/UserModel");
const Product = require("./Models/ProductModel");
const users = require("./data/users");
const ImportData = express.Router();

ImportData.post(
  "/user",
  asyncHandler(async (req, res) => {
    await User.deleteMany({});
    const importUser = await User.insertMany(users);
    res.send({ importUser });
  })
);

ImportData.post(
  "/products",
  asyncHandler(async (req, res) => {
    await Product.deleteMany({});
    const importProduct = await Product.insertMany(products);
    res.send({ importProduct });
  })
);

module.exports = ImportData;
