const Product = require('../models/product');


exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => res.render('shop/index', {
        prods: products, 
        pageTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeIndex: true,
        bootstrapCSS: true
    }));
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => res.render('shop/product-list', {
        prods: products, 
        pageTitle: 'All Products',
        path: '/products',
        hasProducts: products.length > 0,
        activeShop: true,
        bootstrapCSS: true
    }));
}

exports.getCart = (req, res, index) => {
    res.render('shop/cart',  {
        pageTitle: 'Your Cart',
        path: '/cart'
    })
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    })
}