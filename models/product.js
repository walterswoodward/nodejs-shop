const mongodb = require('mongodb');
const { getDb } = require('../util/database');

class Product {
    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? mongodb.ObjectId(id) : null;
        this.userId = userId;
    }

    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            // Update the product
            dbOp = db.collection('products')
                .updateOne(
                    { _id: this._id },
                    { $set: this }
                );
        } else {
            dbOp = db.collection('products').insertOne(this)
        }
        // note that if the collection does not exist, it will be created by mongodb
        return dbOp
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
            .findOne({_id: new mongodb.ObjectId(prodId)})
            .then(product => {
                console.log(product);
                return product;
            })
            .catch(err => console.log(err));
    }

    static deleteById(prodId) {
        const db = getDb();
        return db.collection('products')
            .deleteOne({ _id: new mongodb.ObjectId(prodId) })
            .then(result => {
                console.log('Deleted Item!');
            })
            .catch(err => console.log(err));
    }
}

module.exports = Product;