const mongodb = require('mongodb');
const { getDb } = require('../util/database');

class User {
    constructor(username, email, id) {
        this.name = username;
        this.email = email;
        this._id = id ? mongodb.ObjectId(id) : null;
    }

    saveOrUpdate() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            // Update the user
            dbOp = db.collection('users')
                .updateOne(
                    { _id: this._id },
                    { $set: this }
                );
        } else {
            dbOp = db.collection('users').insertOne(this)
        }
        // note that if the collection does not exist, it will be created by mongodb
        return dbOp
            .then(result => {
                console.log(result);
            }).catch(err => {
                console.error(err);
            });
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users')
            .findOne({_id: new mongodb.ObjectId(userId)})
            .then(user => {
                console.log(user);
                return user;
            })
            .catch(err => console.log(err));
    }
}

module.exports = User;