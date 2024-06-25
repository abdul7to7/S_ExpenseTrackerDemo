const express = require("express");
const sequelize = require("./util/db");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const userRoutes = require("./Routes/userRoutes");
const expenseRoutes = require("./Routes/expenseRoutes");
const User = require("./models/User");
const Expense = require("./models/Expense");
const authenticate = require("./middleware/authVerify");

app.use("/user", userRoutes);
app.use("/expense", authenticate, expenseRoutes);

app.use("/", (req, res) => {
  res.status(404).send("Page not found");
});

User.hasMany(Expense);
Expense.belongsTo(User);

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    app.listen(4000);
  })
  .then(() => {
    console.log("server is running");
  });
