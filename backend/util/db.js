const Sequelize = require("sequelize");

const sequelize = new Sequelize("expense_demo", "root", "root", {
  dialect: "mysql",
  host: "postgresql://expense_tracker_demo_sql_59b5_user:3ardFjmdwmeCTh12grIxR8FJuAkFPIgE@dpg-cq7kqfbv2p9s73c61rm0-a.singapore-postgres.render.com/expense_tracker_demo_sql_59b5",
});

module.exports = sequelize;
