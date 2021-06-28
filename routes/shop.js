const path = require('path');
const express = require('express');

const router = express.Router();

// note that with router.get -- the first param is an exact matched route path
router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'shop.html'));
});

module.exports = router;