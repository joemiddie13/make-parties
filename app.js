// Initialize express
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const models = require('./db/models');
const methodOverride = require('method-override')
const setupAuthRoutes = require('./controllers/auth')
const cookieParser = require('cookie-parser')

// require handlebars
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

// Parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
setupAuthRoutes(app);
app.use(cookieParser());

require('./controllers/events')(app, models);
require('./controllers/rsvps')(app, models);

// Use "main" as our default layout
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main', handlebars: allowInsecurePrototypeAccess(Handlebars) }));

// Use handlebars to render
app.set('view engine', 'handlebars');
app.use(methodOverride('_method'))

// Choose a port to listen on
const port = process.env.PORT || 3000;

// Tell the app what port to listen on
app.listen(port, () => {
  console.log('App listening on port 3000!')
})