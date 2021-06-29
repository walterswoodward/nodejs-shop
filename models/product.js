const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');
const unqid = require('uniqid');

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
    constructor(title, imageUrl, price, description) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        this.id = unqid();
        getProductsFromFile((products) => {
            products.unshift(this); // note that 'this' refers to the containing class only b/c it is inside of an arrow function
            fs.writeFile(p, JSON.stringify(products), (err) => console.log(err));
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