require('dotenv').config();
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.locals.moment = require('moment');

app.set('view engine', 'pug'); // pug supports this syntax out of the box
app.set('views', 'views'); // views is the default so this isn't necessary, but just to be explicit -- find pug templates in views/

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { get404 } = require('./controllers/error');
const sequelize = require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

// convert express requests to json
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// Note that this anonymous function was "registered" as middleware for all incoming request, 
// but is not called until a request is made to the server (started previously with `npm start`)
app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

// express.static(root, [options]) -- grants access to these dependencies
// Note (from docs) that you can designate multiple static assets directories: https://expressjs.com/en/starter/static-files.html
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use('/js', express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));

// outsource routes
// app.use('/admin', adminRoutes);
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Handle 404
app.use(get404);

// User <=> Product Association: One to Many
User.hasMany(Product);
// constraints: true ensures the referential integrity of userId in products corresponding to an existing user in the users table
// onDelete: 'CASCADE' means that if a user is deleted, then all products belonging to that user will also be deleted
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

// Models: User, Product, Cart, Order AND
// Two composite unique key tables: CartItem, OrderItem
// // These tables mainly store the Many to Many relationships between two tables with a Many to Many association
// // For CartItem: cartId <=> productId + quantity
// // For OrderItem: orderId <=> productId + quantity

// User <=> Cart Association: One to One
User.hasOne(Cart);
Cart.belongsTo(User); // This isn't strictly necessary, but can be added for additional clarity -- it is implied by User.hasOne(Cart)

// User <=> Orders Association: One to Many
User.hasMany(Order); // A user can have multiple orders of course
Order.belongsTo(User); // This makes sense, since any given Order will only belong to ONE user

// Cart <=> Product Association: Many to Many
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

// Order <=> Product Association: Many to Many
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem }); // This isn't strictly necessary -- just for clarity

let currentUser;
sequelize
    // .sync({ force: true }) // Tables recreated each time
    .sync()
    .then(result => {
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            return User.create({
                name: 'Walter',
                email: 'walter@nodejs.com'
            });
        }
        return user;
    })
    .then(user => {
        if (user) {
            console.log('User with name: ' + user.name + " created!");
            currentUser = user;
        } else {
            console.error('Failed to create user!');
        }
        return user.getCart();
    })
    .then(cart => {
        if (!cart) {
            return currentUser.createCart();
        }
        return cart;
    })
    .then(cart => {
        app.listen(3000);
    })
    .catch(err => console.log(err));
