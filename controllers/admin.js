const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product
        .fetchAll()
        .then(products => 
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
            hasProducts: products.length > 0
        })
    ).catch(err => console.log(err));
}

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false // this isn't really necessary
    });
}

exports.postAddProduct = (req, res, next) => {
    const { title, imageUrl, price, description } = req.body;

    // This syntax works only b/c of the associations established between products and users in app.js
    const product = new Product(title, price, description, imageUrl, null, req.user._id)
    product
        .save()
        .then(result => {
            console.log('Created Product!');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}

exports.getEditProduct = (req, res) => {
    const editMode = req.query.edit; // this is set on shop/index.pug link
    if (!editMode) { // this just demonstrates how you can use query params to pass additional information -- realistically this will nevery happen
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
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
        .catch(err => console.log(err));
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const { title, imageUrl, price, description } = req.body;
    const product = new Product(title, price, description, imageUrl, prodId, req.user._id);
    product.save()
        .then(result => {
            console.log("Product Updated!");
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    // TODO: Move redirect inside of Product.deleteById as callback
    Product.deleteById(prodId)
    .then(() => {
        console.log('Product Destroyed!');
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
    res.redirect('/admin/products');
}