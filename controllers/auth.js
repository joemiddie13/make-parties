const models = require('../db/models');
const jwt = require('jsonwebtoken');

function generateJWT(user) {
  const mpJWT = jwt.sign({ id: user.id }, "AUTH-SECRET", { expiresIn: 60*60*24*60 });
  return mpJWT;
}

module.exports = function (app) {
  // GET Sign-up form
  app.get('/sign-up', (req, res) => {
    res.render('sign-up');
  });

  // POST Sign-up data
  app.post('/sign-up', (req, res) => {
    // Extract user data from the request body
    const { firstName, lastName, email, password } = req.body;

    // Create a new user
    models.User.create({ firstName, lastName, email, password })
      .then(user => {
        // User created successfully
        // Generate JWT and set cookie
        const mpJWT = generateJWT(user);
        res.cookie("mpJWT", mpJWT);
        res.redirect('/');
      })
      .catch(error => {
        // Handle error
        console.error('Error creating user:', error);
        res.status(500).send('Internal Server Error');
      });
  });

  // GET Login form
  app.get('/login', (req, res) => {
    res.render('login');
  });

  // LOGIN (POST)
  app.post('/login', (req, res, next) => {
    // look up user with email
    models.User.findOne({ where: { email: req.body.email } })
      .then(user => {
        // compare passwords
        user.comparePassword(req.body.password, function (err, isMatch) {
          // if not match send back to login
          if (!isMatch) {
            return res.redirect('/login');
          }
          // if is match generate JWT
          const mpJWT = generateJWT(user);
          // save jwt as cookie
          res.cookie("mpJWT", mpJWT);
          res.redirect('/');
        });
      })
      .catch(err => {
        // if can't find user return to login
        console.log(err);
        return res.redirect('/login');
      });
  });

  // LOGOUT
  app.get('/logout', (req, res, next) => {
    res.clearCookie('mpJWT');
    return res.redirect('/');
  });
};