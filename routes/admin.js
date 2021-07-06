const express = require('express');
const { getAddProduct, postAddProduct, getProducts, getEditProduct, postEditProduct, postDeleteProduct } = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', getAddProduct);

// /admin/add-product => POST
router.post('/add-product', postAddProduct);

// /admin/edit-product => GET
router.get('/edit-product/:productId', getEditProduct);

// /admin/edit-product => POST
router.post('/edit-product', postEditProduct);

// /admin/products => GET
router.get('/products', getProducts);

// /admin/delete-product => POST
// router.post('/delete-product', postDeleteProduct);

// exports.routes = router;
module.exports = router;