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
const { mongoConnect } = require('./util/database');

// const User = require('./models/user');


// convert express requests to json
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// Note that this anonymous function was "registered" as middleware for all incoming request, 
// but is not called until a request is made to the server (started previously with `npm start`)
app.use((req, res, next) => {
    // User.findByPk(1)
    //     .then(user => {
    //         req.user = user;
    //         next();
    //     })
    //     .catch(err => console.log(err));
    next();
});

// express.static(root, [options]) -- grants access to these dependencies
// Note (from docs) that you can designate multiple static assets directories: https://expressjs.com/en/starter/static-files.html
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use('/js', express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));

// outsource routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// // Handle 404
app.use(get404);

mongoConnect(() => {
    app.listen(3000);
});


