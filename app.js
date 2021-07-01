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


// convert express requests to json
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

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

sequelize.sync()
    .then(result => {
        app.listen(3000);
    })
    .catch(err => console.log(err));
