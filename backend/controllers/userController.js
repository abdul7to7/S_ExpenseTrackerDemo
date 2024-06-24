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

exports.login = (req, res, next) => {
  User.findOne({ where: { mail: req.body.mail, password: req.body.password } })
    .then(() => {
      return res.status(201).json({ message: "login success" });
    })
    .catch(() => {
      return res.json(404).json({ message: "user not found" });
    });
};
