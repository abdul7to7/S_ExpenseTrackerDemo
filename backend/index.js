const express = require("express");
const sequelize = require("./util/db");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const userRoutes = require("./Routes/userRoutes");

app.use("/user", userRoutes);

app.use("/", (req, res) => {
  res.status(404).send("Page not found");
});

sequelize
  //   .sync({ force: true })
  .sync()
  .then(() => {
    app.listen(4000);
  })
  .then(() => {
    console.log("server is running");
  });
