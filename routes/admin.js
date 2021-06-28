const express = require('express');
const { getAddProduct, postAddProduct, getProducts } = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', getAddProduct);

// /admin/products => GET
router.get('/products', getProducts);

// /admin/add-product => POST
router.post('/add-product', postAddProduct);

// exports.routes = router;
module.exports = router;