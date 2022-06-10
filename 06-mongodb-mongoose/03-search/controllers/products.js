const Product = require('./../models/Product');
const productMapper = require('./../mappers/product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const query = decodeURIComponent(ctx.query.query);
  const searchRegexp = new RegExp(query, 'i');

  const products = await Product.find().or([
    {title: searchRegexp},
    {description: searchRegexp},
  ]);

  ctx.body = {products: products.map((product) => productMapper(product))};
};
