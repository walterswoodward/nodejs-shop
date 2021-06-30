const db = require('../util/database');

const Cart = require('./cart');

module.exports = class Product {
    constructor(id, title, imageUrl, price, description) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        // Note question marks which guard against SQL Injection by letting mysql2 handle value injection 
        return db.execute('INSERT INTO products (title, price, imageUrl, description) ' +
            'VALUES (?, ?, ?, ?)',
            [this.title, this.price, this.imageUrl, this.description]
        );
    }

    static deleteById(id) {

    }

    static fetchAll() {
        // Note how this model function simply returns data from the database but does not manipulate it
        // Any manipulation logic should go in the corresponding controller file calling this function
        return db.execute('SELECT * FROM products');
    }

    static findById(id) {
        return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
    }
}