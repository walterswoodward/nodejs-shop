const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

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

User.hasMany(Product);
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

User.hasOne(Cart);
Cart.belongsTo(User); // This isn't strictly necessary, but can be added for additional clarity -- it is implied by User.hasOne(Cart)

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize
    // .sync({ force: true }) // Tables recreated each time
    .sync()
    .then(result => {
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            User.create({
                name: 'Walter',
                email: 'walter@nodejs.com'
            });
        }
        return user;
    })
    .then(user => {
        return user.createCart();
    })
    .then(cart => {
        app.listen(3000);
    })
    .catch(err => console.log(err));
