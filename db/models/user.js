const bcrypt = require('bcrypt');

'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  });

  User.associate = function(models) {
    // Define associations if needed
  };

  User.addHook('beforeCreate', async function(user) {
    const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
    console.log(user);
    user.password = await bcrypt.hash(user.password, salt); // Hash the password with the generated salt
  });

  return User;
};