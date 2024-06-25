const express = require("express");
const sequelize = require("./util/db");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const session = require("express-session");

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(
  session({
    secret: "X", // Replace with a long random string for session encryption
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure to true if using HTTPS
  })
);

const userRoutes = require("./Routes/userRoutes");
const expenseRoutes = require("./Routes/expenseRoutes");
const User = require("./models/User");
const Expense = require("./models/Expense");

app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use(express.static(path.join(__dirname, "../frontend")));

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
