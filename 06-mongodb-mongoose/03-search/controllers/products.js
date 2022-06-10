const Product = require('./../models/Product');
const productMapper = require('./../mappers/product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const query = decodeURIComponent(ctx.query.query);

  const products = await Product.find(
      {$text: {$search: query}},
      {score: {$meta: 'textScore'}},
  ).sort({score: {$meta: 'textScore'}});

  ctx.body = {products: products.map((product) => productMapper(product))};
};
