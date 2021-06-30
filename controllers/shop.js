const Product = require('../models/product');
const Cart = require('../models/cart');


exports.getIndex = (_req, res, _next) => {
    Product.fetchAll()
    .then(([rows, _fieldData]) => {
        res.render('shop/index', {
            prods: rows,
            pageTitle: 'Shop',
            path: '/',
            hasProducts: rows.length > 0
        })
        
    })
    .catch(err => {
        console.log(err);
    });
}

exports.getProduct = (req, res, _next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(([products]) => res.render('shop/product-detail', {
            product: products[0],
            pageTitle: products[0].title,
            path: '/products',
        }))
        .catch(err => console.log(err));
}

exports.getProducts = (_req, res, _next) => {
    Product.fetchAll()
    .then(([rows, _fieldData]) => {
        res.render('shop/product-list', {
            prods: rows,
            pageTitle: 'All Products',
            path: '/products',
            hasProducts: rows.length > 0
        })
        
    })
    .catch(err => {
        console.log(err);
    });
}

exports.getCart = (_req, res, _index) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData) {
                    cartProducts.push({ productData: product, qty: cartProductData.qty });
                }
            }
            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart',
                products: cartProducts
            });
        })
    });
}

exports.getOrders = (_req, res, _index) => {
    res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders'
    })
}

exports.getCheckout = (_req, res, _next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    })
}

exports.postCart = (req, _res, _next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.addProduct(prodId, product.price);
    });
}

exports.postCartDeleteProduct = (req, res, _next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    });
}