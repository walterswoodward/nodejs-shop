const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product', 
        path: '/admin/add-product',
        bootstrapCSS: true,
        activeAddProduct: true
    });
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => res.render('admin/products', {
        prods: products, 
        pageTitle: 'Admin Products',
        path: '/admin/products',
        hasProducts: products.length > 0,
        activeProducts: true,
        bootstrapCSS: true
    }));
}

exports.postAddProduct = (req, res, next) => {
    const {title, imageUrl, price, description} = req.body;
    const product = new Product(
        title,
        imageUrl,
        price,
        description
    );
    product.save();
    res.redirect('/');
}
