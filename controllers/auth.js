const models = require('../db/models')
const jwt = require('jsonwebtoken')

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
    models.User.create({
      firstName,
      lastName,
      email,
      password
    })
    .then(user => {
      // User created successfully
      res.redirect('/');
    })
    .catch(error => {
      // Handle error
      console.error('Error creating user:', error);
      res.status(500).send('Internal Server Error');
    });
    // after creating the user
    const mpJWT = generateJWT(user);
    res.cookie("mpJWT", mpJWT);
    res.redirect('/');
  });

  // GET Login form
  app.get('/login', (req, res) => {
    res.render('login');
  });

  // POST Login data
  app.post('/login', (req, res) => {
    // Implement your login logic here
    // For now, just log the received data and redirect to the home page
    console.log('Login data:', req.body);
    res.redirect('/');
  });
};
