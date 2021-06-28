const express = require('express');
const { getProducts, getIndex, getCart, getCheckout, getOrders } = require('../controllers/shop');

const router = express.Router();

// note that with router.get -- the first param is an exact matched route path
router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/cart', getCart);

router.get('/orders', getOrders);

router.get('/checkout'), getCheckout;

module.exports = router;