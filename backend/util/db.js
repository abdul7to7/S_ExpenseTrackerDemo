const Sequelize = require("sequelize");

const sequelize = new Sequelize("expense_demo", "root", "root", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
