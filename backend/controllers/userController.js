const User = require("../models/User");

exports.userSignUp = (req, res, next) => {
  User.create({
    username: req.body.username,
    mail: req.body.mail,
    password: req.body.password,
  })
    .then(() => {
      return res.status(201).json({ message: "user succesfully created" });
    })
    .catch((err) => {
      return res.json({ message: `error occured ${err.message}` });
    });
};
