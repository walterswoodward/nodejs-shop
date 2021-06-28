const express = require('express');

const { getProducts } = require('../controllers/products');

const router = express.Router();

// note that with router.get -- the first param is an exact matched route path
router.get('/', getProducts);

module.exports = router;