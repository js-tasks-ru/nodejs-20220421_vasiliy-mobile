const mongoose = require('mongoose');
const Product = require('./../models/Product');
const productMapper = require('./../mappers/product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  const products = await Product.find({subcategory});

  ctx.body = {products: products.map((product) => productMapper(product))};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();

  ctx.body = {products: products.map((product) => productMapper(product))};
};

module.exports.productById = async function productById(ctx, next) {
  const productId = ctx.params.id;

  if (!mongoose.isValidObjectId(productId)) {
    ctx.status = 400;

    return;
  }

  const product = await Product.findById(productId);

  if (product) {
    ctx.body = {product: productMapper(product)};
  } else {
    ctx.status = 404;
  }
};
