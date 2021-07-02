const express = require('express');
const { getProducts, getIndex, getCart, getCheckout, getOrders, getProduct, postCart, postCartDeleteProduct, postOrder } = require('../controllers/shop');

const router = express.Router();

// note that with router.get -- the first param is an exact matched route path
router.get('/', getIndex);

router.get('/products', getProducts);

// note: all dynamic segments need to be beneath all common specific routes
router.get('/products/:productId', getProduct);

router.get('/cart', getCart);

router.get('/orders', getOrders);

router.get('/checkout'), getCheckout;

router.post('/cart', postCart);

router.post('/create-order', postOrder);

router.post('/cart-delete-item', postCartDeleteProduct);

module.exports = router;