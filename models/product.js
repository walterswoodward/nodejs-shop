const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');
const uniqid = require('uniqid');

const Cart = require('./cart');

const p = path.join(
    rootDir,
    'data',
    'products.json'
);

const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err) return cb([]);
        cb(JSON.parse(fileContent));
    })
}

module.exports = class Product {
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile((products) => {
            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), (err) => console.log(err));
            } else {
                this.id = uniqid();
                products.unshift(this); // note that 'this' refers to the containing class only b/c it is inside of an arrow function
                fs.writeFile(p, JSON.stringify(products), (err) => console.log(err));
            }
        });
    }

    static deleteById(id) {
        getProductsFromFile((products) => {
            const product = products.find(prod => prod.id === id);
            const updatedProducts = products.filter(prod => prod.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                if (!err) {
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            cb(product);
        });
    }
}