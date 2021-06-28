const path = require('path');
const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

// note that with router.get -- the first param is an exact matched route path
router.get('/', (req, res, next) => {
    console.log(adminData.products);
    res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;