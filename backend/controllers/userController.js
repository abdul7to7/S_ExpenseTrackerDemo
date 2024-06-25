const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.userSignUp = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hashed) => {
    if (!hashed) {
      return res.status(500).json(err);
    }
    User.create({
      username: req.body.username,
      mail: req.body.mail,
      password: hashed,
    })
      .then(() => {
        return res.status(201).json({ message: "user succesfully created" });
      })
      .catch((err) => {
        return res.json({ message: `error occured ${err.message}` });
      });
  });
};

exports.login = (req, res, next) => {
  User.findOne({ where: { mail: req.body.mail } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "login failed" });
      }
      bcrypt.compare(req.body.password, user.password).then((result) => {
        if (!result) return res.status(401).json({ message: "login failed" });
        else {
          return res.status(201).json(user);
        }
      });
    })
    .catch(() => {
      return res.json(500).json({ message: `error occured ${err.message}` });
    });
};
