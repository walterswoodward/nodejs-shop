const Product = require('../models/product');
const Cart = require('../models/cart');


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

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product => res.render('shop/product-detail', {
        product: product, 
        pageTitle: product.title,
        path: '/products',
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

exports.getOrders = (req, res, index) => {
    res.render('shop/orders',  {
        pageTitle: 'Your Orders',
        path: '/orders'
    })
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    })
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    console.log(prodId);
    Product.findById(prodId, product => {
        Cart.addProduct(prodId, product.price);
    });
}