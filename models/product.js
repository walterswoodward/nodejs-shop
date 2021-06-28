const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

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
    constructor(title) {
        this.title = title;
    }

    save() {
        getProductsFromFile((products) => {
            products.unshift(this); // note that 'this' refers to the containing class only b/c it is inside of an arrow function
            fs.writeFile(p, JSON.stringify(products), (err) => console.log(err));
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }
}