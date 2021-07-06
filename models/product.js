const mongodb = require('mongodb');
const { getDb } = require('../util/database');

class Product {
    constructor(title, price, description, imageUrl) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    save() {
        const db = getDb();
        // note that if the collection does not exist, it will be created by mongodb
        return db.collection('products')
            .insertOne(this)
            .then(result => {
                console.log(result);
            }).catch(err => {
                console.error(err);
            });
    }

    static fetchAll() {
        const db = getDb();
        return db
            .collection('products')
            .find()
            .toArray()
            .then(products => {
                console.log(products);
                return products;
            })
            .catch(err => console.log(err));
    }

    static findById(prodId) {
        const db = getDb();
        // Two important things to remember here:
        // 1. MongoDB stores its ids as special MongoDB object ids
        // 2. MongoDB returns its ids as `_id`
        return db.collection('products')
            .find({_id: new mongodb.ObjectId(prodId)}) // returns a cursor so we call next()
            .next()
            .then(product => {
                console.log(product);
                return product;
            })
            .catch(err => console.log(err));
    }
}

module.exports = Product;