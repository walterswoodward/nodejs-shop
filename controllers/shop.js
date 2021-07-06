const Product = require('../models/product');
// const Cart = require('../models/cart');
// const Order = require('../models/order');


exports.getIndex = (_req, res, _next) => {
    Product.fetchAll().then(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            hasProducts: products.length > 0
        })
    }).catch(err => console.log(err));
}

exports.getProduct = (req, res, _next) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId) // alternatively Product.findByAll({where: {id: prodId}...}) could be used -- see sequelize docs
        .then((product) => res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products',
        }))
        .catch(err => console.log(err));
}

exports.getProducts = (_req, res, _next) => {
    Product.fetchAll().then(products => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
            hasProducts: products.length > 0
        })
    }).catch(err => console.log(err));
}

exports.getCart = (req, res, _index) => {
    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts();
        })
        .then(cartProducts => {
            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart',
                products: cartProducts
            });
        })
        .catch(err => console.log(err));
}

exports.getOrders = (req, res, _index) => {
    req.user
        .getOrders({ include: ['products'] }) // eager loading
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Your Orders',
                path: '/orders',
                orders: orders,
                moment: require('moment')
            })
        })
        .catch(err => console.log(err));

}

exports.getCheckout = (_req, res, _next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    })
}

exports.postCart = (req, res, _next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: prodId } })
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findByPk(prodId);
        })
        .then(product => {
            return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}

exports.postOrder = (req, res, next) => {
    let cartProducts;
    let fetchedCart;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            cartProducts = products;
            return req.user.createOrder();
        })
        .then(order => {
            order.addProducts(cartProducts.map(product => {
                product.orderItem = { quantity: product.cartItem.quantity };
                return product;
            }))
        })
        .then(_result => {
            return fetchedCart.setProducts(null);
           
        })
        .then(_result => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
}

exports.postCartDeleteProduct = (req, res, _next) => {
    const prodId = req.body.productId;
    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: prodId } })
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err =>  console.log(err));

    Product.findByPk(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    });
}