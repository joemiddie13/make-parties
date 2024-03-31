// Initialize express
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const models = require('./db/models');
const methodOverride = require('method-override');
const setupAuthRoutes = require('./controllers/auth');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// require handlebars
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

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

app.use(function authenticateToken(req, res, next) {
  // Gather the jwt access token from the cookie
  const token = req.cookies.mpJWT;

  if (token) {
    jwt.verify(token, "AUTH-SECRET", (err, user) => {
      if (err) {
        console.log(err);
        // redirect to login if not logged in and trying to access a protected route
        res.redirect('/login');
      }
      req.user = user;
      next(); // pass the execution off to whatever request the client intended
    });
  } else {
    next();
  }
});

app.use((req, res, next) => {
  // if a valid JWT token is present
  if (req.user) {
    // Look up the user's record
    models.User.findByPk(req.user.id)
      .then(currentUser => {
        // make the user object available in all controllers and templates
        res.locals.currentUser = currentUser;
        next();
      })
      .catch(err => {
        console.log(err);
        next();
      });
  } else {
    next();
  }
});