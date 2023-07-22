const express = require("express");
const asyncHandler = require("express-async-handler");
const Product = require("../Models/ProductModel");
const protect = require("../Middleware/AuthMiddleware");
const ApiFeatures = require("../utils/apifeatures");

const productRoute = express.Router();

// get all products
// productRoute.get(
//   "/",
//   asyncHandler(async (req, res) => {

//     const pageSize = 2;
//     const page = Number(req.query.page) || 1;
//     const count = await Product.countDocuments()

//     const keyword = req.query.keyword 
//     ? {
//       name : {
//         $regex : req.query.keyword,
//         $options :"i"
//       }
//     }
//     : {}

//     const products = await Product.find({ ...keyword })
//       .limit(pageSize)
//       .skip(pageSize * (page - 1))
//       .sort({ _id: -1 });
//     res.json({products, page, pages: Math.ceil(count / pageSize)});
//   })
// );

// get all products
productRoute.get(
  "/",
  asyncHandler(async (req, res) => {
    const resultPerPage = 8
    const page =  Number(req.query.page) || 1;
    console.log(req.query);
    const keyword = req.query.keyword 
    ? {
      name : {
        $regex : req.query.keyword,
        $options :"i"
      }
    }
    : {}
    
    const productCount = await Product.countDocuments({ ...keyword})
    const count = await Product.countDocuments()
    const apiFeature = new ApiFeatures(Product.find(), req.query)
      .search()
      .filter()
      .pagination(resultPerPage)

      const products = await  apiFeature.query
      
    res.status(200).json({ products, page, pages: Math.ceil( productCount/resultPerPage) })
  })
);

// GET SINGLE PRODUCT
productRoute.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  })
);

//Product Review
productRoute.post(
  "/:id/review",
  protect,
  asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );
      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already Reviewed");
      }
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;


      await product.save();
      res.status(201).json({ message: "Review Added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  })
);

module.exports = productRoute;
