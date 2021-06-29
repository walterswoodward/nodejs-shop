const express = require('express');
const { getProducts, getIndex, getCart, getCheckout, getOrders, getProduct, postCart } = require('../controllers/shop');

const router = express.Router();

// note that with router.get -- the first param is an exact matched route path
router.get('/', getIndex);

router.get('/products', getProducts);

// note: all dynamic segments need to be beneath all specific routes
router.get('/products/:productId', getProduct);

router.get('/cart', getCart);

router.post('/cart', postCart);

router.get('/orders', getOrders);

router.get('/checkout'), getCheckout;

module.exports = router;