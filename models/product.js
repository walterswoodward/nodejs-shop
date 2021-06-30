const db = require('../util/database');

const Cart = require('./cart');

module.exports = class Product {
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {

    }

    static deleteById(id) {

    }

    static fetchAll() {
        // Note how this model function simply returns data from the database but does not manipulate it
        // Any manipulation logic should go in the corresponding controller file calling this function
        return db.execute('SELECT * FROM products');
    }

    static findById(id) {
    }
}