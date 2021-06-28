const express = require('express');

const { getAddProduct, postAddProduct } = require('../controllers/products');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', getAddProduct);

// /admin/add-product => POST
router.post('/add-product', postAddProduct);

// exports.routes = router;
module.exports = router;