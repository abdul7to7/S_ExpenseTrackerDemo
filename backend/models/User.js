const Sequelize = require("sequelize");
const sequelize = require("../util/db");

const User = sequelize.define("user", {
  username: {
    type: Sequelize.STRING,
    nullAllowed: false,
  },
  mail: {
    type: Sequelize.STRING,
    nullAllowed: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    nullAllowed: false,
  },
  isPremium: {
    type: Sequelize.BOOLEAN,
    nullAllowed: false,
    defaultValue: false,
  },
});
module.exports = User;
