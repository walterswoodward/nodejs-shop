const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false // this isn't really necessary
    });
}

exports.getEditProduct = (req, res) => {
    const editMode = req.query.edit; // this is set on shop/index.pug link
    if (!editMode) { // this just demonstrates how you can use query params to pass additional information -- realistically this will nevery happen
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        if (!product) {
            // TODO: Replace this with error message
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    })
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        hasProducts: products.length > 0
    }));
}

exports.postAddProduct = (req, res, next) => {
    const { title, imageUrl, price, description } = req.body;
    const product = new Product(
        null,
        title,
        imageUrl,
        price,
        description
    );
    product
        .save()
        .then(() => res.redirect('/'))
        .catch(err => console.log(err));
    res.redirect('/');
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const { title, imageUrl, price, description } = req.body;
    const updatedProduct = new Product(
        prodId,
        title,
        imageUrl,
        price,
        description
    );
    // TODO: Move redirect inside of updateProduct.save as callback
    updatedProduct.save();
    res.redirect('/admin/products');
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    // TODO: Move redirect inside of Product.deleteById as callback
    Product.deleteById(prodId);
    res.redirect('/admin/products');
}