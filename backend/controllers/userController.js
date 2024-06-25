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
  User.findOne({ where: { mail: req.body.mail } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "login failed" });
      }
      if (user.password != req.body.password) {
        return res.status(401).json({ message: "login failed" });
      }
      return res.status(201).json(user);
    })
    .catch(() => {
      return res.json(500).json({ message: `error occured ${err.message}` });
    });
};
